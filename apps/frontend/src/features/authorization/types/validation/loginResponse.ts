import { z } from 'zod';

export const loginResponse = z.object({
  id: z.string(),
  name: z.string(),
  password: z.string(),
  roles: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  email: z.string(),
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponse>;
