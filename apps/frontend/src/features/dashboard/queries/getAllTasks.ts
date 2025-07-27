import { protectedRoute } from '../../../utils/api';
import { TaskListResponse } from '../types/validation/taskListResponseSchema';

const TASK_LIST_LIMIT = 20;

export const getAllTasks = (page: number) =>
  protectedRoute<TaskListResponse>('/task', 'GET', {
    page,
    limit: TASK_LIST_LIMIT,
  }).then((res) => res.data);
