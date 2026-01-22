import apiClient from '@/lib/api-client';
import { FormValues } from '../schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUser(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        fullname: values.fullname,
        phone: values.phone,
        ...(values.password ? { password: values.password } : {}),
      };

      return apiClient(`/users/${userId}`, {
        method: 'PATCH',
        data: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
