import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewTaskInput, UpdateTaskInput } from '../types/http/task.http';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';

const taskRouter: Router = Router();
const taskController = new TaskController();

taskRouter.get('/',checkUserAuthorization, taskController.getTasks);
taskRouter.get(
  '/:taskId',
  checkUserAuthorization,
  validateRequestInput<NewTaskInput>,
  taskController.getTaskById
);
taskRouter.post(
  '/',
  checkUserAuthorization,
  validateRequestInput<UpdateTaskInput>,
  taskController.createTask
);
taskRouter.put('/:taskId', checkUserAuthorization, taskController.updateTask);
taskRouter.delete('/:taskId', checkUserAuthorization, taskController.deleteTask);

export { taskRouter as taskRoutes };
