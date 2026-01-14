import { Card, CardContent } from '@/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              {children}

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
      </div>
    </div>
  );
}
