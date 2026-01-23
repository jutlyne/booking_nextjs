import { ColumnDef } from '@tanstack/react-table';
import { User } from '../schema';
import { Checkbox } from '@/components/ui/checkbox';
import { UserDrawer } from './user-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { toast } from 'sonner';
import Link from 'next/link';

export const userColumns: ColumnDef<User>[] = [
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
    accessorKey: 'fullname',
    header: 'Tên nhân viên',
    cell: ({ row }) => <UserDrawer user={row.original} />,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
  },
  {
    accessorKey: 'avatar',
    header: 'Ảnh đại diện',
    cell: ({ row }) => (
      <img
        src={row.original.avatarUrl ?? 'https://picsum.photos/200'}
        alt={row.original.fullname}
        className='h-8 w-8 rounded-full object-cover'
      />
    ),
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => <Badge variant='outline'>{row.original.role}</Badge>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const { mutate, isPending } = useDeleteUser();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost'>
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={'/users/' + user.id + '/edit'}>Edit</Link>
            </DropdownMenuItem>

            <ConfirmDialog
              title='Xoá người dùng'
              description={`Bạn có chắc chắn muốn xoá "${user.fullname}"?`}
              trigger={
                <DropdownMenuItem
                  className='text-red-600 focus:text-red-600'
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete
                </DropdownMenuItem>
              }
              onConfirm={() => mutate(user.id)}
              onSuccess={() => toast.success('Xóa người dùng thành công!')}
              loading={isPending}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
