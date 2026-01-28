import { z } from 'zod';

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
  leaderName: z.string(),
});

export type Team = z.infer<typeof teamSchema>;

export const formSchema = z.object({});

export type FormValues = z.infer<typeof formSchema>;
