import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export function useStats(dateRange?: string) {
  return useQuery({
    queryKey: ['dashboardStats', dateRange],
    queryFn: () => dashboardApi.getStats(dateRange)
  });
}

export function useCharts(metric: string, dateRange?: string) {
  return useQuery({
    queryKey: ['dashboardCharts', metric, dateRange],
    queryFn: () => dashboardApi.getCharts(metric, dateRange)
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['recentOrders'],
    queryFn: () => dashboardApi.getRecentOrders()
  });
}

export function useRecentReplies() {
  return useQuery({
    queryKey: ['recentReplies'],
    queryFn: () => dashboardApi.getRecentReplies()
  });
}

export function useAutomationActivity() {
  return useQuery({
    queryKey: ['automationActivity'],
    queryFn: () => dashboardApi.getAutomationActivity()
  });
}
