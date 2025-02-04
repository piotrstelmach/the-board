import { AuthorizationContextType } from './authorizationContext';
import { ActionTypes } from './actionTypes';

export type AuthorizationAction =
  | { type: ActionTypes.SET_TOKEN; payload: { token: string } }
  | { type: ActionTypes.SET_USER; payload: { user: any } }
  | { type: ActionTypes.SET_AUTHORIZED; payload: { isAuthorized: boolean } };

export const AuthorizationReducer = (
  state: AuthorizationContextType,
  action: AuthorizationAction
) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case ActionTypes.SET_AUTHORIZED:
      return {
        ...state,
        isAuthorized: action.payload.isAuthorized,
      };
    default:
      return state;
  }
};
