import React, { createContext, PropsWithChildren } from 'react';
import { AuthorizationAction, AuthorizationReducer } from './reducer';
import { SessionUser } from '../../../types/sessionUser';
import { protectedRoute } from '../../../utils/api';
import { RefreshTokenResponse } from '../../../types/validation/refreshTokenReponse';
import { ActionTypes } from './actionTypes';
import { mapSessionUser } from '../../../services/userMapper';

export type AuthorizationContextType = {
  isAuthorized: boolean;
  user: SessionUser | null;
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

  const refreshToken = async () => {
    try {
      const { data } = await protectedRoute<RefreshTokenResponse>(
        '/auth/refresh-token',
        'post',
        '',
        {
          refreshToken: state.token,
        }
      );
      if (data?.accessToken) {
        dispatch({
          type: ActionTypes.SET_TOKEN,
          payload: { token: data.accessToken },
        });
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { user: mapSessionUser(data) },
        });
        dispatch({
          type: ActionTypes.SET_AUTHORIZED,
          payload: { isAuthorized: true },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    refreshToken();
  }, []);

  return (
    <AuthorizationStateContext.Provider value={state}>
      <AuthorizationDispatchContext.Provider value={dispatch}>
        {children}
      </AuthorizationDispatchContext.Provider>
    </AuthorizationStateContext.Provider>
  );
};
