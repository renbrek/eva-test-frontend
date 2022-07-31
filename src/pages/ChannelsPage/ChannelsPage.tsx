import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { thunkFetchAllByCampaignId } from '../../store/currentChannels/currentChannels.slice';

export const ChannelsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { campaignId } = useParams();

  const currentChannelsState = useAppSelector((state) => state.currentChannels);

  useEffect(() => {
    if (campaignId) {
      dispatch(thunkFetchAllByCampaignId(campaignId));
    }
  }, [dispatch]);

  return <div>ChannelsPage:{campaignId}</div>;
};
