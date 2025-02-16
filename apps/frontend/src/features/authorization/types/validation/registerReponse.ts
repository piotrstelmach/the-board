import { z } from 'zod';

export const registerResponse = z.object({
  id: z.string(),
  name: z.string(),
  roles: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  email: z.string(),
  accessToken: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponse>;
