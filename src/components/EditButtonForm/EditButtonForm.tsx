import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
  deleteButtonById,
  thunkDeleteButtonById,
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';
import { Button, Channel } from '../../store/currentChannels/types';

interface Props {
  button: Button;
  channelIndex: number;
}

export const EditButtonForm: React.FC<Props> = ({ button, channelIndex }) => {
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector(
    (state) => state.currentChannels.channels[channelIndex]
  );

  const handleDeleteButton = async () => {
    if (button.id) await dispatch(thunkDeleteButtonById(button.id));
    await dispatch(thunkFetchAllByCampaignId(currentChannel.campaignId));
  };

  return (
    <div>
      <div>{button.id}</div>
      <button onClick={handleDeleteButton}>Delete</button>
    </div>
  );
};
