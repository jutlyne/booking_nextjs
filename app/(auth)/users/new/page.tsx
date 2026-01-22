'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formSchema, FormValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue('avatar', file);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'user',
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      await apiClient('/users', {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Tạo mới người dùng thành công');

      router.push('/users');
    } catch (error) {
      console.log(error);
      toast.error('Tạo mới người dùng thất bại');
    }
  };

  return (
    <div className='flex items-start  justify-center min-h-screen p-4'>
      <Card className='w-full max-w-7xl shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Tạo người dùng mới
          </CardTitle>
          <CardDescription>
            Nhập đầy đủ thông tin bên dưới để khởi tạo tài khoản hệ thống.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                Thông tin tài khoản
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='name'>Tên đăng nhập</Label>
                  <Input
                    id='name'
                    placeholder='User name'
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='email@example.com'
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='password'>Mật khẩu</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='role'>Vai trò</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        'role',
                        value as 'user' | 'admin' | 'super_admin',
                      )
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn vai trò' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='user'>User</SelectItem>
                      <SelectItem value='admin'>Admin</SelectItem>
                      <SelectItem value='super_admin'>Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className='space-y-4'>
              <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                Thông tin cá nhân
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5 md:col-span-2'>
                  <Label htmlFor='fullname'>Họ và tên</Label>
                  <Input
                    id='fullname'
                    placeholder='Nguyễn Văn A'
                    {...register('fullname')}
                  />
                  {errors.fullname && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='phone'>Số điện thoại</Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='090...'
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='teamId'>Team ID</Label>
                  <Input
                    id='teamId'
                    type='number'
                    placeholder='101'
                    {...register('teamId', { valueAsNumber: true })}
                  />
                  {errors.teamId && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.teamId.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='space-y-4'>
                <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                  Ảnh đại diện
                </h3>

                <div className='flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed rounded-xl bg-slate-50/30 transition-colors hover:bg-slate-50/50'>
                  <div className='relative group'>
                    <Avatar className='h-28 w-28 border-4 border-white shadow-xl ring-1 ring-slate-200'>
                      <AvatarImage
                        src={preview || undefined}
                        className='object-cover'
                      />
                      <AvatarFallback className='bg-gradient-to-br from-slate-100 to-slate-200'>
                        <Camera className='h-10 w-10 text-slate-400' />
                      </AvatarFallback>
                    </Avatar>

                    <label
                      htmlFor='avatar-upload'
                      className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity'
                    >
                      <Camera className='h-6 w-6 text-white' />
                    </label>
                  </div>

                  <div className='flex-1 space-y-3 text-center sm:text-left'>
                    <div className='space-y-1'>
                      <h4 className='font-medium text-sm'>
                        Cập nhật ảnh hồ sơ
                      </h4>
                      <p className='text-xs text-muted-foreground'>
                        Nên chọn ảnh vuông, định dạng JPG hoặc PNG. Dung lượng
                        dưới 2MB.
                      </p>
                    </div>

                    <div className='flex flex-wrap justify-center sm:justify-start gap-2'>
                      <input
                        id='avatar-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleFileChange}
                      />

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='bg-white shadow-sm'
                        asChild
                      >
                        <label
                          htmlFor='avatar-upload'
                          className='cursor-pointer'
                        >
                          Chọn ảnh mới
                        </label>
                      </Button>

                      {preview && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='text-red-500 hover:text-red-600 hover:bg-red-50'
                          onClick={() => {
                            setPreview(null);
                            setValue('avatar', undefined);
                          }}
                        >
                          Xóa ảnh
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex justify-end gap-3 bg-slate-50/50 p-6'>
            <Button variant='outline' type='button' onClick={() => reset()}>
              Hủy
            </Button>
            <Button type='submit' className='px-8' disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
