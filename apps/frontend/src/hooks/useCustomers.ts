import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../api/customers.api';

export function useCustomers(filters: any) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customersApi.getCustomers(filters)
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.getCustomer(id),
    enabled: !!id
  });
}

export function useCustomerConversation(id: string) {
  return useQuery({
    queryKey: ['customerConversation', id],
    queryFn: () => customersApi.getConversation(id),
    enabled: !!id
  });
}

export function useCustomerOrders(id: string) {
  return useQuery({
    queryKey: ['customerOrders', id],
    queryFn: () => customersApi.getOrders(id),
    enabled: !!id
  });
}

export function useUpdateOptIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, optIn }: { id: string, optIn: boolean }) => customersApi.updateOptIn(id, optIn),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

export function useSegmentCustomers() {
  return useMutation({
    mutationFn: (conditions: any) => customersApi.segment(conditions)
  });
}
