import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const registerInputSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string(),
}) satisfies z.Schema<Prisma.UserCreateInput>

export const loginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});