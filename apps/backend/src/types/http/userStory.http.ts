import { z } from 'zod'
import { newUserStoryInputSchema, updateUserStoryInputSchema } from '../../validators/userStory';

export type NewUserStoryInput = z.infer<typeof newUserStoryInputSchema>;
export type UpdateUserStoryInput = z.infer<typeof updateUserStoryInputSchema>;