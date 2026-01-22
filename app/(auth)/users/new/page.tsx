'use client';

import { formSchema } from './schema';
import apiClient from '@/lib/api-client';
import { UserForm } from '../components/user-form';

export default function Page() {
  return (
    <UserForm
      schema={formSchema}
      defaultValues={{ role: 'user' }}
      mode='create'
      onSubmit={async (formData) => {
        await apiClient('/users', {
          method: 'POST',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }}
    />
  );
}
