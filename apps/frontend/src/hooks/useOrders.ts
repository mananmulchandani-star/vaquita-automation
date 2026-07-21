import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';

export function useOrders(filters: any) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getOrders(filters).then(res => res.data?.data || res.data)
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id).then(res => res.data?.data || res.data),
    enabled: !!id
  });
}

export function useOrderTimeline(id: string) {
  return useQuery({
    queryKey: ['orderTimeline', id],
    queryFn: () => ordersApi.getTimeline(id).then(res => res.data?.data || res.data),
    enabled: !!id
  });
}

export function useConfirmCOD() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.confirmCOD(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

export function useResendConfirmation() {
  return useMutation({
    mutationFn: (id: string) => ordersApi.resendConfirmation(id)
  });
}

export function useUpdateTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tags }: { id: string, tags: string[] }) => ordersApi.updateTags(id, tags),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    }
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string, note: string }) => ordersApi.addNote(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orderTimeline', variables.id] });
    }
  });
}
