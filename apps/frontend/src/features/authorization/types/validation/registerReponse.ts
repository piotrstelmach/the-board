import { z } from 'zod';

export const registerResponse = z.object({
  accessToken: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponse>;
