import { UserStoryController } from '../controllers/userStory.controller';
import { Router } from 'express';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewUserStoryInput, UpdateUserStoryInput } from '../types/http/userStory.http';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization';

const userStoryRouter: Router = Router();
const userStoryController = new UserStoryController();

userStoryRouter.get('/', checkUserAuthorization, userStoryController.getUserStories);
userStoryRouter.get('/:userStoryId', checkUserAuthorization, userStoryController.getSingleUserStory);
userStoryRouter.post('/', checkUserAuthorization, validateRequestInput<NewUserStoryInput>, userStoryController.createUserStory);
userStoryRouter.put('/:userStoryId', checkUserAuthorization, validateRequestInput<UpdateUserStoryInput>, userStoryController.updateUserStory);
userStoryRouter.delete('/:userStoryId', checkUserAuthorization, userStoryController.deleteUserStory);

export { userStoryRouter as userStoryRoutes };