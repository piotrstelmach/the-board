import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const newUserInputValidator = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string(),
  roles: z.number().gte(1, "Invalid role").lte(4, "Invalid role"),
}) satisfies z.Schema<Prisma.UserCreateInput>

export const updateUserRequestBodyValidator = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string()),
  password: z.optional(z.string()),
  roles: z.optional(z.number().gte(1, "Invalid role").lte(4, "Invalid role"),),
}) satisfies z.Schema<Prisma.UserUpdateInput>

export const giveRoleInputValidator = z.object({
  roles: z.number().gte(1, "Invalid role").lte(4, "Invalid role"),
}) satisfies z.Schema<Prisma.UserUpdateInput>

