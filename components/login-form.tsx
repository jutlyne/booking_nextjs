'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { authApi } from '@/lib/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      await authApi.login(formData);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
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
          <div className='bg-muted relative hidden md:block'>
            <img
              src='/globe.svg'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
