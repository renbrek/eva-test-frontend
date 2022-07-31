import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useAuth } from '../../hooks/useAuth';
import { thunkLogin } from '../../store/auth/auth.slice';

import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const isAuth = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    dispatch(thunkLogin({ email, password }));
  };

  useEffect(() => {
    auth.thunks.login.error && setErrorMessage(auth.thunks.login.error);
  }, [auth.thunks.login.error]);

  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth]);

  return (
    <section className={styles.container}>
      <p className={errorMessage ? styles.errmsg : styles.offscreen}>
        {errorMessage}
      </p>
      <h1>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Email:
        </label>
        <input
          type="text"
          id="email"
          autoComplete="off"
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
          value={email}
          required
        />
        <label className={styles.label} htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          id="password"
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
          value={password}
          required
        />
        <button className={styles.submitButton}>Login</button>
      </form>
      <p>
        Does not registered?
        <br />
        <span className={styles.line}>
          <NavLink to={'/registration'}>Sign Up</NavLink>
        </span>
      </p>
    </section>
  );
};
