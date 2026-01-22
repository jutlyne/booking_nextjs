import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient('/users');
      return res.data.data;
    },
  });
}
