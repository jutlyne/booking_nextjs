import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string().email(),
  phone: z.number(),
  avatar: z.string(),
  role: z.string(),
  avatarUrl: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const formSchema = z.object({
  fullname: z.string().min(1, 'Tên không được để trống'),
  phone: z.number().optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Mật khẩu tối thiểu 6 ký tự',
    }),
});

export type FormValues = z.infer<typeof formSchema>;
