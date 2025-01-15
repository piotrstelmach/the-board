import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const newTaskInputValidator = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.number(),
}) satisfies z.Schema<Prisma.TaskCreateInput>

export const updateTaskRequestBodyValidator = z.object({
  title: z.optional(z.string()),
  description: z.optional(z.string()),
  userId: z.optional(z.number()),
}) satisfies z.Schema<Prisma.TaskUpdateInput>