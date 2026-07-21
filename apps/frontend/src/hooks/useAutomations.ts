import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationsApi } from '../api/automations.api';

export function useAutomations(filters?: any) {
  return useQuery({
    queryKey: ['automations', filters],
    queryFn: () => automationsApi.getAutomations(filters)
  });
}

export function useAutomation(id: string) {
  return useQuery({
    queryKey: ['automation', id],
    queryFn: () => automationsApi.getAutomation(id),
    enabled: !!id
  });
}

export function useAutomationTemplates() {
  return useQuery({
    queryKey: ['automationTemplates'],
    queryFn: () => automationsApi.getTemplates()
  });
}

export function useCreateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => automationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    }
  });
}

export function useUpdateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => automationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['automation', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    }
  });
}

export function useToggleAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string, active: boolean }) => automationsApi.toggle(id, active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['automation', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    }
  });
}

export function useAutomationRuns(id: string) {
  return useQuery({
    queryKey: ['automationRuns', id],
    queryFn: () => automationsApi.getRuns(id),
    enabled: !!id
  });
}
