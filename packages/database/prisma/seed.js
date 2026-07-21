"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create store
    const store = await prisma.store.create({
        data: {
            shopifyDomain: 'vaquita-store.myshopify.com',
            shopifyStoreId: '1234567890',
            name: 'Vaquita World',
            email: 'admin@vaquitaworld.com',
            accessToken: 'encrypted_dummy_token',
            scopesGranted: ['read_orders', 'write_orders', 'read_customers'],
            shopifyPlan: 'shopify_plus',
            currency: 'INR',
        },
    });
    // Create admin user
    await prisma.user.create({
        data: {
            storeId: store.id,
            email: 'admin@vaquitaworld.com',
            name: 'Admin User',
            role: client_1.UserRole.ADMIN,
            passwordHash: 'dummy_hash', // replace with hashed password in real app
        },
    });
    // Create customers
    const customers = [];
    for (let i = 1; i <= 5; i++) {
        const customer = await prisma.customer.create({
            data: {
                storeId: store.id,
                shopifyCustomerId: `c_${i}`,
                email: `customer${i}@example.com`,
                phone: `+91987654321${i}`,
                firstName: `First${i}`,
                lastName: `Last${i}`,
                whatsappOptIn: client_1.OptInStatus.OPTED_IN,
                totalSpend: 1500 * i,
                orderCount: i,
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
            },
        });
        customers.push(customer);
    }
    // Create orders
    for (let i = 0; i < 10; i++) {
        const customer = customers[i % 5];
        const isCod = i % 2 === 0;
        await prisma.order.create({
            data: {
                storeId: store.id,
                customerId: customer.id,
                shopifyOrderId: `o_${i}`,
                orderNumber: `#100${i}`,
                email: customer.email,
                phone: customer.phone,
                financialStatus: isCod ? client_1.FinancialStatus.PENDING : client_1.FinancialStatus.PAID,
                fulfillmentStatus: client_1.FulfillmentStatus.UNFULFILLED,
                paymentMethod: isCod ? client_1.PaymentMethod.COD : client_1.PaymentMethod.PREPAID,
                currency: 'INR',
                totalPrice: 1500,
                subtotalPrice: 1500,
                lineItems: [{ id: 'item_1', name: 'Product A', price: 1500, quantity: 1 }],
                shopifyCreatedAt: new Date(),
                shippingAddress: { city: 'Mumbai', country: 'India' },
                billingAddress: { city: 'Mumbai', country: 'India' },
            },
        });
    }
    // Create Templates
    await prisma.whatsappTemplate.create({
        data: {
            storeId: store.id,
            name: 'cod_confirmation',
            category: client_1.TemplateCategory.UTILITY,
            status: client_1.TemplateStatus.APPROVED,
            components: [
                { type: 'HEADER', format: 'TEXT', text: 'Order Confirmation' },
                { type: 'BODY', text: 'Hi {{1}}, your COD order {{2}} for {{3}} is confirmed.' },
                { type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Confirm COD' }, { type: 'QUICK_REPLY', text: 'Cancel Order' }] }
            ],
        },
    });
    await prisma.whatsappTemplate.create({
        data: {
            storeId: store.id,
            name: 'shipping_update',
            category: client_1.TemplateCategory.UTILITY,
            status: client_1.TemplateStatus.APPROVED,
            components: [
                { type: 'BODY', text: 'Hi {{1}}, your order {{2}} has been shipped via {{3}}. Track it here: {{4}}' }
            ],
        },
    });
    // Create Automations
    await prisma.automation.create({
        data: {
            storeId: store.id,
            name: 'COD Confirmation Flow',
            triggerType: client_1.AutomationTrigger.ORDER_CREATED,
            isActive: true,
            flowDefinition: {
                nodes: [{ id: '1', type: 'trigger' }, { id: '2', type: 'sendTemplate', templateName: 'cod_confirmation' }],
                edges: [{ source: '1', target: '2' }]
            },
        },
    });
    // Create Settings
    await prisma.setting.create({
        data: {
            storeId: store.id,
            key: 'business_hours',
            category: 'general',
            value: { start: '09:00', end: '18:00', timezone: 'Asia/Kolkata', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
        }
    });
    console.log('Seeding completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
