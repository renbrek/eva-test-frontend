import React, { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
  thunkCreateCampaign,
  thunkFetchCampaigns,
} from '../../store/campaigns/campaigns.slice';

import styles from './CreateCampaignForm.module.scss';

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateCampaignForm: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const campaignsState = useAppSelector((state) => state.campaigns);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(thunkCreateCampaign(name));
    await dispatch(thunkFetchCampaigns());
    setName('');
  };

  useEffect(() => {
    if (campaignsState.thunks.createCampaign.error) {
      setErrorMessage(campaignsState.thunks.createCampaign.error);
    }
    if (!campaignsState.thunks.createCampaign.error) {
      setErrorMessage('');
    }
  }, [campaignsState.thunks.createCampaign.error]);

  return (
    <section className={styles.container}>
      <p className={errorMessage ? styles.errmsg : styles.offscreen}>
        {errorMessage}
      </p>
      <h1>Create Campaign</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <>
          <label className={styles.label} htmlFor="title">
            Name:
          </label>
          <input
            type="text"
            id="title"
            autoComplete="off"
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
            value={name}
            required
          />
        </>
        <button className={styles.submitButton}>Create</button>
      </form>
    </section>
  );
};
