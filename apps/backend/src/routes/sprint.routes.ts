import { Router } from 'express';
import { SprintController } from '../controllers/sprint.controller';


const sprintRouter: Router = Router();
const sprintController = new SprintController();

sprintRouter.get('/', sprintController.getSprints);
sprintRouter.get('/:sprintId', sprintController.getSingleSprint);
sprintRouter.post('/', sprintController.createSprint);
sprintRouter.put('/:sprintId', sprintController.updateSprint);
sprintRouter.delete('/:sprintId', sprintController.deleteSprint);

export { sprintRouter as sprintRoutes };
