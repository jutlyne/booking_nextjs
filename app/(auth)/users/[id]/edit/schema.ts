import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'super_admin']),
  fullname: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.preprocess(
    (v) => (v instanceof File ? v : undefined),
    z.instanceof(File).optional(),
  ),
  teamId: z.number().optional(),
  isRemoveAvatar: z.boolean().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
