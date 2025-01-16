import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const newSprintInputValidator = z.object({
  name: z.string(),
  goal: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  totalPoints: z.number().optional(),
}) satisfies z.Schema<Prisma.SprintCreateInput>

export const updateSprintRequestBodyValidator = z.object({
  name: z.string().optional(),
  goal: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalPoints: z.number().optional(),
}) satisfies z.Schema<Prisma.SprintUpdateInput>