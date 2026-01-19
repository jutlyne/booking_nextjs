'use client';

import { DataTable, type User } from '@/components/data-table';
import apiClient, { ApiResponse } from '@/lib/api-client';
import { useEffect, useState } from 'react';

import data from './data.json';

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await apiClient<ApiResponse<User[]>>('/users');
        console.log(result.data.data);
        setUsers(result.data.data);
      } catch (err: any) {
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='p-6'>
      <DataTable data={users} isLoading={loading} />
    </div>
  );
}
