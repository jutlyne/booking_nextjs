'use client';

import { formSchema, FormValues } from './schema';
import apiClient from '@/lib/api-client';
import { UserForm } from '../../components/user-form';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Page() {
  const [defaultValues, setDefaultValues] =
    useState<Partial<FormValues> | null>(null);
  const params = useParams();
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await apiClient(`/users/${params.id}`);

        setDefaultValues(user.data);
      } catch (error) {
        console.error('Lấy dữ liệu user thất bại', error);
      } finally {
      }
    }

    fetchUser();
  }, [params.id]);

  return (
    <UserForm
      schema={formSchema}
      defaultValues={{ ...defaultValues }}
      mode='update'
      onSubmit={async (formData) => {
        await apiClient(`/users/${params.id}`, {
          method: 'PATCH',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }}
    />
  );
}
