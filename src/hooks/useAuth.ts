import { useEffect, useState } from 'react';
import { AccessTokenService } from '../services/AccessTokenService';
import { useAppDispatch, useAppSelector } from './redux.hooks';

export const useAuth = (): boolean => {
  const auth = useAppSelector((state) => state.auth);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (AccessTokenService.getToken())
      if (auth.isAuthenticated) setIsAuth(true);
    if (!auth.isAuthenticated) setIsAuth(false);
  }, [auth.isAuthenticated]);

  return isAuth;
};
