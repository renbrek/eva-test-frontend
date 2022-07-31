import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaigns } from '../../components/Campaigns/Campaigns';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useAuth } from '../../hooks/useAuth';
import { thunkLogout } from '../../store/auth/auth.slice';
import { resetCampaigns } from '../../store/campaigns/campaigns.slice';
import { resetUser, thunkFetchUser } from '../../store/user/user.slice';

import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const isAuth = useAuth();

  const currentUser = useAppSelector((state) => state.user.current);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(thunkLogout());
    dispatch(resetUser());
    dispatch(resetCampaigns());
  };

  useEffect(() => {
    if (isAuth) {
      dispatch(thunkFetchUser());
    }
  }, [dispatch, isAuth]);

  return (
    <div>
      <div>Home Page</div>
      <br />
      {isAuth ? (
        <div>
          <p>Hello, {currentUser?.email}</p>
          <p>Your ID: {currentUser?.id}</p>
          <button onClick={handleLogout}>Logout</button>

          <div className={styles.content}>
            <Campaigns />
          </div>
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button onClick={() => navigate('/login')}>Sign In</button>
          <br />
          <button onClick={() => navigate('/registration')}>Sign Up</button>
        </div>
      )}
    </div>
  );
};
