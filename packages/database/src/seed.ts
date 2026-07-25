import { PrismaClient, OptInStatus, FinancialStatus, FulfillmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  const store = await prisma.store.findFirst();
  if (!store) {
    console.log('No store found. Skipping seed.');
    return;
  }

  console.log(`Seeding data for store ${store.shopifyDomain}...`);

  const customers = [];
  for (let i = 0; i < 15; i++) {
    const customer = await prisma.customer.create({
      data: {
        storeId: store.id,
        shopifyCustomerId: `gid://shopify/Customer/${1000 + i}`,
        firstName: ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram'][i % 5],
        lastName: ['Sharma', 'Patel', 'Kumar', 'Gupta', 'Singh'][i % 5],
        email: `customer${i}@example.com`,
        phone: `+91987654321${i % 10}`,
        city: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad'][i % 5],
        whatsappOptIn: i % 3 !== 0 ? OptInStatus.OPTED_IN : OptInStatus.OPTED_OUT,
        totalSpend: 1500 * ((i % 5) + 1),
        orderCount: (i % 5) + 1,
      }
    });
    customers.push(customer);
  }
  
  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    await prisma.order.create({
      data: {
        storeId: store.id,
        customerId: customer.id,
        shopifyOrderId: `gid://shopify/Order/${2000 + i}`,
        orderNumber: `#ORD-${2045 + i}`,
        totalPrice: 1299 + i * 150,
        subtotalPrice: 1299 + i * 150,
        currency: 'INR',
        financialStatus: i % 3 === 0 ? FinancialStatus.PENDING : FinancialStatus.PAID,
        fulfillmentStatus: i % 4 === 0 ? FulfillmentStatus.FULFILLED : FulfillmentStatus.UNFULFILLED,
        paymentMethod: i % 2 === 0 ? 'COD' : 'PREPAID',
        shopifyCreatedAt: new Date(),
        lineItems: {},
        shippingAddress: {},
        billingAddress: {},
        tags: ['New', 'Summer Sale']
      }
    });
  }

  console.log('Seeded 20 orders.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
