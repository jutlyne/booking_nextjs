'use client';

import { Team } from './schema';
import { useTeams } from './hooks/useTeams';
import { DataTable } from '@/components/data-table';
import { teamColumns } from './components/team-columns';

export default function Page() {
  const { data: teams, isLoading: loading } = useTeams();

  return (
    <div className='p-6'>
      <DataTable<Team>
        data={teams ?? []}
        columns={teamColumns}
        createUrl='/users/new'
        isLoading={loading}
      />
    </div>
  );
}
