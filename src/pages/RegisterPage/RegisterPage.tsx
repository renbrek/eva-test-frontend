import React, { useState, useEffect, useRef, RefObject } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useAuth } from '../../hooks/useAuth';
import { thunkRegister } from '../../store/auth/auth.slice';
import { EMAIL_REGEX, PWD_REGEX } from '../../utils/regex';

import styles from './RegisterPage.module.scss';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailIsFocus, setEmailIsFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordIsFocus, setPasswordIsFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [matchIsValid, setMatchIsValid] = useState(false);
  const [matchIsFocus, setMatchIsFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const isAuth = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const isValidData = EMAIL_REGEX.test(email) && PWD_REGEX.test(password);

    if (!isValidData) {
      setErrorMessage('Invalid Entry');
      return;
    }

    dispatch(thunkRegister({ email, password }));
  };

  useEffect(() => {
    auth.thunks.register.error && setErrorMessage(auth.thunks.register.error);
  }, [auth.thunks.register.error]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setEmailIsValid(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setPasswordIsValid(result);
    const match = password === matchPassword;
    setMatchIsValid(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage('');
  }, [email, password, matchPassword]);

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
      <h1>Sign Up</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Email:
          <span className={emailIsValid ? styles.valid : styles.hide}>V</span>
          <span
            className={emailIsValid || !email ? styles.hide : styles.invalid}
          >
            X
          </span>
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
          aria-invalid={emailIsValid ? 'false' : 'true'}
          aria-describedby="emailnote"
          onFocus={() => setEmailIsFocus(true)}
          onBlur={() => setEmailIsFocus(false)}
        />
        <p
          id="emailnote"
          className={
            emailIsFocus && email && !emailIsValid
              ? styles.instructions
              : styles.offscreen
          }
        >
          Please enter a correct email address.
        </p>
        <label className={styles.label} htmlFor="password">
          Password:
          <span className={passwordIsValid ? styles.valid : styles.hide}>
            V
          </span>
          <span
            className={
              passwordIsValid || !password ? styles.hide : styles.invalid
            }
          >
            X
          </span>
        </label>
        <input
          type="password"
          id="password"
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
          value={password}
          required
          aria-invalid={passwordIsValid ? 'false' : 'true'}
          aria-describedby="pwdnote"
          onFocus={() => setPasswordIsFocus(true)}
          onBlur={() => setPasswordIsFocus(false)}
        />
        <p
          id="pwdnote"
          className={
            passwordIsFocus && password && !passwordIsValid
              ? styles.instructions
              : styles.offscreen
          }
        >
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:{' '}
          <span aria-label="exclamation mark">!</span>{' '}
          <span aria-label="at symbol">@</span>{' '}
          <span aria-label="hashtag">#</span>{' '}
          <span aria-label="dollar sign">$</span>{' '}
          <span aria-label="percent">%</span>
        </p>
        <label className={styles.label} htmlFor="confirm_pwd">
          Confirm Password:
          <span
            className={
              matchIsValid && matchPassword ? styles.valid : styles.hide
            }
          >
            V
          </span>
          <span
            className={
              matchIsValid || !matchPassword ? styles.hide : styles.invalid
            }
          >
            X
          </span>
        </label>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(event) => {
            setMatchPassword(event.currentTarget.value);
          }}
          value={matchPassword}
          required
          aria-invalid={matchIsValid ? 'false' : 'true'}
          aria-describedby="confirmnote"
          onFocus={() => setMatchIsFocus(true)}
          onBlur={() => setMatchIsFocus(false)}
        />
        <p
          id="confirmnote"
          className={
            matchIsFocus && !matchIsValid
              ? styles.instructions
              : styles.offscreen
          }
        >
          Must match the first password input field.
        </p>
        <button
          className={styles.submitButton}
          disabled={
            !emailIsValid || !passwordIsValid || !matchIsValid ? true : false
          }
        >
          Register
        </button>
      </form>
      <p>
        Already registred?
        <br />
        <span className={styles.line}>
          <NavLink to={'/login'}>Sign In</NavLink>
        </span>
      </p>
    </section>
  );
};
