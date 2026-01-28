'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export default function Page() {
  useEffect(() => {
    toast.error('Tài khoản của bạn đã bị khóa!');

    signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  }, []);

  return (
    <div className='flex flex-col item-center justify-center h-screen'></div>
  );
}
