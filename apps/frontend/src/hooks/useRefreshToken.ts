import { TOKEN_EXPIRATION_TIME } from '../config/api';
import React, { useContext } from 'react';
import { unprotectedRoute } from '../utils/api';
import {
  AuthorizationDispatchContext,
  AuthorizationStateContext,
} from '../stores/context/authorization/authorizationContext';
import { ActionTypes } from '../stores/context/authorization/actionTypes';
import { RefreshTokenResponse } from '../types/validation/refreshTokenReponse';
import { mapSessionUser } from '../services/userMapper';

export const useRefreshToken = () => {
  const { token } = useContext(AuthorizationStateContext);
  const dispatch = useContext(AuthorizationDispatchContext);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    if (token) {
      timeoutRef.current = setTimeout(async () => {
        const { data } = await unprotectedRoute<RefreshTokenResponse>(
          '/auth/refresh-token',
          'post',
          '',
          {
            refreshToken: token,
          }
        );
        dispatch({
          type: ActionTypes.SET_TOKEN,
          payload: { token: data?.accessToken },
        });
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { user: mapSessionUser<RefreshTokenResponse>(data) },
        });
        dispatch({
          type: ActionTypes.SET_AUTHORIZED,
          payload: { isAuthorized: true },
        });
      }, TOKEN_EXPIRATION_TIME);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [dispatch, timeoutRef, token]);
};
