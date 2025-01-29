import { Router } from 'express';
import { SprintController } from '../controllers/sprint.controller';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';
import { validateRequestParams } from '../middleware/validateRequestInput';
import { paginationValidator } from '../validators/pagination';

const sprintRouter: Router = Router();
const sprintController = new SprintController();

sprintRouter.get(
  '/',
  validateRequestParams(paginationValidator),
  checkUserAuthorization,
  sprintController.getSprints
);
sprintRouter.get(
  '/:sprintId',
  checkUserAuthorization,
  sprintController.getSingleSprint
);
sprintRouter.post('/', checkUserAuthorization, sprintController.createSprint);
sprintRouter.put(
  '/:sprintId',
  checkUserAuthorization,
  sprintController.updateSprint
);
sprintRouter.delete(
  '/:sprintId',
  checkUserAuthorization,
  sprintController.deleteSprint
);

export { sprintRouter as sprintRoutes };
