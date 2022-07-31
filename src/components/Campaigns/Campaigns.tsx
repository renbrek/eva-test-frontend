import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useAuth } from '../../hooks/useAuth';
import { thunkFetchCampaigns } from '../../store/campaigns/campaigns.slice';
import { CampaignItem } from '../CampaignItem/CampaignItem';
import { CreateCampaignForm } from '../CreateCampaignForm/CreateCampaignForm';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './Campaigns.module.scss';

export const Campaigns: React.FC = () => {
  const dispatch = useAppDispatch();

  const [createCampaignIsOpen, setCreateCampaignIsOpen] =
    useState<boolean>(false);

  const isAuth = useAuth();

  const campaignsState = useAppSelector((state) => state.campaigns);

  const handleNewCampaign = () => {
    setCreateCampaignIsOpen(true);
  };

  useEffect(() => {
    if (isAuth) dispatch(thunkFetchCampaigns());
  }, [isAuth]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>My Campaigns</h2>
          <button className={styles.addButton} onClick={handleNewCampaign}>
            +
          </button>
        </div>
        <div className={styles.items}>
          {campaignsState.campaigns.length ? (
            campaignsState.campaigns.map((campaign) => (
              <CampaignItem campaign={campaign} key={campaign.id} />
            ))
          ) : (
            <div>No tasks</div>
          )}
        </div>
      </div>
      <ModalWindow
        active={createCampaignIsOpen}
        setActive={setCreateCampaignIsOpen}
      >
        <CreateCampaignForm setActive={setCreateCampaignIsOpen} />
      </ModalWindow>
    </>
  );
};
