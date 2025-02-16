import React, { useContext } from 'react';
import {
  AuthorizationContextType,
  AuthorizationStateContext,
} from '../stores/context/authorization/authorizationContext';
import { Navigate } from 'react-router';

export const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { isAuthorized } = useContext<AuthorizationContextType>(
    AuthorizationStateContext
  );

  if (!isAuthorized) {
    return <Navigate to={'/'} replace />;
  }
  return children;
};
