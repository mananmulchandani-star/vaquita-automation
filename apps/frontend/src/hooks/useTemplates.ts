import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesApi } from '../api/templates.api';

export function useTemplates(filters?: any) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: () => templatesApi.getTemplates(filters)
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.getTemplate(id),
    enabled: !!id
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => templatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
}

export function useSyncTemplates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => templatesApi.sync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
}
