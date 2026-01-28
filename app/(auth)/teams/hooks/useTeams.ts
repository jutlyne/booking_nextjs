import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await apiClient('/teams');
      return res.data.data;
    },
  });
}
