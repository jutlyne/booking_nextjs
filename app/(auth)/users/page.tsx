'use client';

import { User } from './schema';
import { useUsers } from './hooks/useUsers';
import { DataTable } from '@/components/data-table';
import { userColumns } from './components/user-columns';

export default function Page() {
  const { data: users, isLoading: loading } = useUsers();

  return (
    <div className='p-6'>
      <DataTable<User>
        data={users ?? []}
        columns={userColumns}
        createUrl='/users/new'
        isLoading={loading}
      />
    </div>
  );
}
