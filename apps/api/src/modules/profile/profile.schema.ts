import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  image: z.url().nullable(),
  createdAt: z.iso.datetime(),
});

export type Profile = z.infer<typeof ProfileSchema>;
