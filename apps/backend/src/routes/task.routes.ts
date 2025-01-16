import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewSprintInput, UpdateSprintInput } from '../types/http/sprint.http';

const taskRouter: Router = Router();
const taskController = new TaskController();

taskRouter.get('/', taskController.getTasks)
taskRouter.get('/:taskId', taskController.getTaskById)
taskRouter.post('/',validateRequestInput<NewSprintInput>, taskController.createTask)
taskRouter.put('/:taskId',validateRequestInput<UpdateSprintInput>, taskController.updateTask)
taskRouter.delete('/:taskId', taskController.deleteTask)

export { taskRouter as taskRoutes };