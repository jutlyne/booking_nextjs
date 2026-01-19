'use client';

import * as React from 'react';
import { z } from 'zod';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutColumns,
  IconChevronDown,
  IconPlus,
  IconChevronsRight,
  IconChevronsLeft,
} from '@tabler/icons-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SpinnerCustom } from './ui/spinner';
import { ROLES } from '@/lib/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const schema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string(),
  role: z.string(),
});

export type User = z.infer<typeof schema>;

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

export function DataTable({
  data: initialData,
  isLoading,
}: {
  data: User[];
  isLoading: boolean;
}) {
  const [data, setData] = React.useState(initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className='flex flex-col gap-4'>
      <Label htmlFor='view-selector' className='sr-only'>
        View
      </Label>
      <div className='flex items-center justify-end px-4'>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <IconLayoutColumns />
                <span className='hidden lg:inline'>Tùy chỉnh cột</span>
                <span className='lg:hidden'>Cột</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    column.getCanHide() &&
                    typeof column.accessorFn !== 'undefined'
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant='outline' size='sm'>
            <IconPlus />
            <span className='hidden lg:inline'>Thêm</span>
          </Button>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <SpinnerCustom className='size-6' />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>

      <div className='flex items-center justify-between px-4'>
        <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex w-full items-center gap-8 lg:w-fit'>
          <div className='flex w-fit items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className='ml-auto flex items-center gap-2 lg:ml-0'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant='outline'
              className='size-8'
              size='icon'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant='outline'
              className='size-8'
              size='icon'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant='outline'
              className='hidden size-8 lg:flex'
              size='icon'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
