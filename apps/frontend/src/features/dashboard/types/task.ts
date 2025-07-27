import { z } from 'zod';

export const TaskStatusSchema = z.enum([
  'TODO',
  'IN_PROGRESS',
  'DONE',
  'BLOCKED',
]);

export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const TaskSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: TaskStatusSchema,
  title: z.string(),
  description: z.string().nullable(),
  priority: TaskPrioritySchema,
  storyPoints: z.number().nullable(),
  assigneeId: z.number().nullable(),
  sprintId: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
