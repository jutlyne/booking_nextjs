'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function Page() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  }, []);

  return (
    <div className='flex flex-col item-center justify-center h-screen'></div>
  );
}
