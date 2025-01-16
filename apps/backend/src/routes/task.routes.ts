import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewTaskInput, UpdateTaskInput } from '../types/http/task.http';

const taskRouter: Router = Router();
const taskController = new TaskController();

taskRouter.get('/', taskController.getTasks);
taskRouter.get(
  '/:taskId',
  validateRequestInput<NewTaskInput>,
  taskController.getTaskById
);
taskRouter.post(
  '/',
  validateRequestInput<UpdateTaskInput>,
  taskController.createTask
);
taskRouter.put('/:taskId', taskController.updateTask);
taskRouter.delete('/:taskId', taskController.deleteTask);

export { taskRouter as taskRoutes };
