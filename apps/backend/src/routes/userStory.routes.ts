import { UserStoryController } from '../controllers/userStory.controller';
import { Router } from 'express';
import { validateRequestInput } from '../middleware/validateRequestInput';
import { NewUserStoryInput, UpdateUserStoryInput } from '../types/http/userStory.http';

const userStoryRouter: Router = Router();
const userStoryController = new UserStoryController();

userStoryRouter.get('/', userStoryController.getUserStories);
userStoryRouter.get('/:userStoryId', userStoryController.getSingleUserStory);
userStoryRouter.post('/', validateRequestInput<NewUserStoryInput>, userStoryController.createUserStory);
userStoryRouter.put('/:userStoryId', validateRequestInput<UpdateUserStoryInput>, userStoryController.updateUserStory);
userStoryRouter.delete('/:userStoryId', userStoryController.deleteUserStory);

export { userStoryRouter as userStoryRoutes };