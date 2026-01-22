import { useIsMobile } from '@/hooks/use-mobile';
import { formSchema, FormValues, User } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserDrawer({ user }: { user: User }) {
  const isMobile = useIsMobile();
  const { mutateAsync } = useUpdateUser(user.id);

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: user.fullname,
      phone: user.phone ?? '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await mutateAsync(values);
      toast.success('Cập nhật người dùng thành công');
    } catch (error) {
      toast.error('Cập nhật người dùng thất bại');
      form.reset();
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerTrigger asChild>
        <Button variant='link' className='px-0'>
          {user.fullname}
        </Button>
      </DrawerTrigger>

      <DrawerContent className='max-w-md'>
        <DrawerHeader className='border-b'>
          <DrawerTitle>Chỉnh sửa người dùng</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6 px-4 py-4'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.fullname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className='font-medium'>{user.fullname}</p>
                <p className='text-sm text-muted-foreground'>{user.email}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex flex-col gap-2'>
                <Label>Tên</Label>
                <Input {...register('fullname')} />
                {errors.fullname && (
                  <p className='text-sm text-red-500'>
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Số điện thoại</Label>
                <Input {...register('phone')} />
                {errors.phone && (
                  <p className='text-sm text-red-500'>{errors.phone.message}</p>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Mật khẩu mới</Label>
                <Input
                  type='password'
                  placeholder='Để trống nếu không đổi'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DrawerFooter className='border-t'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>

            <DrawerClose asChild>
              <Button type='button' variant='outline'>
                Đóng
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
