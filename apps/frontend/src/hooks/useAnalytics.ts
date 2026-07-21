import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export function useOverview(dateRange: string) {
  return useQuery({
    queryKey: ['analyticsOverview', dateRange],
    queryFn: () => analyticsApi.getOverview(dateRange)
  });
}

export function useMessageAnalytics(dateRange: string) {
  return useQuery({
    queryKey: ['messageAnalytics', dateRange],
    queryFn: () => analyticsApi.getMessageAnalytics(dateRange)
  });
}

export function useRevenueAnalytics(dateRange: string) {
  return useQuery({
    queryKey: ['revenueAnalytics', dateRange],
    queryFn: () => analyticsApi.getRevenueAnalytics(dateRange)
  });
}

export function useCODAnalytics(dateRange: string) {
  return useQuery({
    queryKey: ['codAnalytics', dateRange],
    queryFn: () => analyticsApi.getCODAnalytics(dateRange)
  });
}
