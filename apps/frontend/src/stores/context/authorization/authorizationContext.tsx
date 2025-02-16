import React, { createContext, PropsWithChildren } from 'react';
import { AuthorizationAction, AuthorizationReducer } from './reducer';
import { LoggedUser } from '../../../types/loggedUser';

export type AuthorizationContextType = {
  isAuthorized: boolean;
  user: LoggedUser | null;
  token: string | null;
};

const initialState = {
  isAuthorized: false,
  user: null,
  token: null,
};

export const AuthorizationStateContext =
  createContext<AuthorizationContextType>(initialState);

export const AuthorizationDispatchContext = createContext<
  React.Dispatch<AuthorizationAction>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>(() => {});

export const AuthorizationProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(
    AuthorizationReducer,
    initialState
  );

  return (
    <AuthorizationStateContext.Provider value={state}>
      <AuthorizationDispatchContext.Provider value={dispatch}>
        {children}
      </AuthorizationDispatchContext.Provider>
    </AuthorizationStateContext.Provider>
  );
};
