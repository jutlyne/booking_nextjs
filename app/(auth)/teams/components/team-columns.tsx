import { ColumnDef } from '@tanstack/react-table';
import { Team } from '../schema';
import { Checkbox } from '@/components/ui/checkbox';

export const teamColumns: ColumnDef<Team>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Tên nhóm',
  },
  {
    accessorKey: 'leaderName',
    header: 'Tên trưởng nhóm',
  },
  {
    accessorKey: 'avatar',
    header: 'Ảnh đại diện',
    cell: ({ row }) => (
      <img
        src={row.original.avatar ?? 'https://picsum.photos/200'}
        alt={row.original.name}
        className='h-8 w-8 rounded-full object-cover'
      />
    ),
  },
];
