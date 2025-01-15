import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const taskRouter: Router = Router();
const taskController = new TaskController();

taskRouter.get('/', taskController.getTasks)
taskRouter.get('/:taskId', taskController.getTaskById)
taskRouter.post('/', taskController.createTask)
taskRouter.put('/:taskId', taskController.updateTask)
taskRouter.delete('/:taskId', taskController.deleteTask)

export { taskRouter as taskRoutes };