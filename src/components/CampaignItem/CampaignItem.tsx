import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux.hooks';
import {
  thunkDeleteCampaignById,
  thunkFetchCampaigns,
} from '../../store/campaigns/campaigns.slice';
import { Campaign } from '../../store/campaigns/types';

import styles from './CampaignItem.module.scss';

interface Props {
  campaign: Campaign;
}

export const CampaignItem: React.FC<Props> = ({ campaign }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteTaskById = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    await dispatch(thunkDeleteCampaignById(id));
    await dispatch(thunkFetchCampaigns());
  };

  const handleClickItem = () => {
    navigate(`/channels/${campaign.id}`);
  };

  return (
    <div className={styles.container} onClick={handleClickItem}>
      <h3>{campaign.name}</h3>
      <button
        className={`${styles.danger} ${styles.button}`}
        onClick={(event) => handleDeleteTaskById(event, campaign.id)}
      >
        delete
      </button>
    </div>
  );
};
