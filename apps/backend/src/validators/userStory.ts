import { z } from 'zod'
import { Prisma, TaskPriority, StoryStatus } from '@prisma/client';

export const newUserStoryInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  storyPoints: z.number().optional(),
}) satisfies z.Schema<Prisma.UserStoryCreateInput>

export const updateUserStoryInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  storyPoints: z.number().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(StoryStatus).optional(),
}) satisfies z.Schema<Prisma.UserStoryUpdateInput>