'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const res = await signIn('credentials', {
      ...formData,
      redirect: false,
    });

    setIsLoading(false);

    if (!res?.error) {
      window.location.href = '/';
    } else {
      console.error(res.error);
    }
  };

  return (
    <form className='p-6 md:p-8' onSubmit={handleSubmit}>
      <FieldGroup>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Welcome back</h1>
          <p className='text-muted-foreground text-balance'>
            Login to your Acme Inc account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder='m@example.com'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </Field>
        <Field>
          <div className='flex items-center'>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <a
              href='#'
              className='ml-auto text-sm underline-offset-2 hover:underline'
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id='password'
            type='password'
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Field>
        <Field>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
