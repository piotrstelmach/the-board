import { z } from 'zod';

export const RefreshTokenResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  roles: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  email: z.string(),
  accessToken: z.string(),
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
