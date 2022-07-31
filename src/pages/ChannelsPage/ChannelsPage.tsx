import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChannelItem } from '../../components/ChannelItem/ChannelItem';
import { Loader } from '../../components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { selectCampaignsById } from '../../store/campaigns/selectors/selectCampaignsById';
import {
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';

import styles from './ChannelsPage.module.scss';

export const ChannelsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const { campaignId } = useParams();

  const navigate = useNavigate();

  const campaign = useAppSelector((state) =>
    selectCampaignsById(state, campaignId)
  );

  const currentChannelsState = useAppSelector((state) => state.currentChannels);

  const handleSave = async () => {
    
    await dispatch(thunkUpdateChannelById(currentChannelsState.channels[0]));
    await dispatch(thunkUpdateChannelById(currentChannelsState.channels[1]));
    await dispatch(thunkUpdateChannelById(currentChannelsState.channels[2]));
    await dispatch(thunkUpdateChannelById(currentChannelsState.channels[3]));
    if (campaign) await dispatch(thunkFetchAllByCampaignId(campaign.id));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (campaign) {
      dispatch(thunkFetchAllByCampaignId(campaign.id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentChannelsState.thunks.fetchAllByCampaignId.status === 'pending') {
      setIsLoading(true);
    }
    if (currentChannelsState.thunks.fetchAllByCampaignId.status !== 'pending') {
      setIsLoading(false);
    }
  }, [currentChannelsState.thunks.fetchAllByCampaignId.status]);

  return isLoading ? (
    <Loader />
  ) : campaign ? (
    <div className={styles.container}>
      <div>ChannelsPage:{campaignId}</div>

      <div className={styles.channels}>
        {currentChannelsState.channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>

      <button onClick={handleSave}>Save</button>
    </div>
  ) : (
    <div>
      Campaign with this id does not exists
      <div>
        <button onClick={handleGoBack}>Go back</button>
      </div>
    </div>
  );
};
