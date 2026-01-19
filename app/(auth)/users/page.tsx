'use client';

import { DataTable } from '@/components/data-table';
import apiClient, { ApiResponse } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLES } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import z from 'zod';

export const schema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string(),
  role: z.string(),
});

export type User = z.infer<typeof schema>;

function UserDrawer({ user }: { user: User }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant='link' className='px-0'>
          {user.fullname}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{user.fullname}</DrawerTitle>
        </DrawerHeader>

        <div className='space-y-4 px-4'>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user.email} />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input defaultValue={user.phone} />
          </div>
          <div className='flex flex-col gap-3'>
            <Label htmlFor='reviewer'>Vai trò</Label>
            <Select defaultValue={user.role}>
              <SelectTrigger id='role' className='w-full'>
                <SelectValue placeholder='Chọn vai trò' />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <Button>Lưu</Button>
          <DrawerClose asChild>
            <Button variant='outline'>Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<User>[] = [
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
          src='https://picsum.photos/200/300'
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost'>
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const {
          data: { data },
        } = await apiClient<ApiResponse<User[]>>('/users');
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='p-6'>
      <DataTable<User> data={users} columns={columns} isLoading={loading} />
    </div>
  );
}
