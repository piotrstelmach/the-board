import { TOKEN_EXPIRATION_TIME } from '../config/api';
import React, { useContext } from 'react';
import { protectedRoute } from '../utils/api';
import {
  AuthorizationDispatchContext,
  AuthorizationStateContext,
} from '../stores/context/authorization/authorizationContext';
import { ActionTypes } from '../stores/context/authorization/actionTypes';

export const useRefreshToken = () => {
  const { token } = useContext(AuthorizationStateContext);
  const dispatch = useContext(AuthorizationDispatchContext);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    if (token) {
      timeoutRef.current = setTimeout(async () => {
        const { data: accessToken } = await protectedRoute(
          '/auth/refresh-token',
          'post'
        );
        dispatch({
          type: ActionTypes.SET_TOKEN,
          payload: { token: accessToken },
        });
      }, TOKEN_EXPIRATION_TIME);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [dispatch, timeoutRef, token]);
};
