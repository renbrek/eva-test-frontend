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

enum ChannelTypes {
  whatsup,
  vk,
  telegram,
  sms,
}

export const ChannelsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const [whatsupIsValid, setWhatsupIsValid] = useState(true);
  const [vkIsValid, setVkIsValid] = useState(true);
  const [telegramIsValid, setTelegramIsValid] = useState(true);
  const [smsIsValid, setSmsIsValid] = useState(true);

  const { campaignId } = useParams();

  const navigate = useNavigate();

  const campaign = useAppSelector((state) =>
    selectCampaignsById(state, campaignId)
  );

  const saveIsActive =
    whatsupIsValid && vkIsValid && telegramIsValid && smsIsValid;

  const currentChannelsState = useAppSelector((state) => state.currentChannels);

  const handleSave = async () => {
    await dispatch(
      thunkUpdateChannelById(
        currentChannelsState.channels[ChannelTypes.whatsup]
      )
    );
    await dispatch(
      thunkUpdateChannelById(currentChannelsState.channels[ChannelTypes.vk])
    );
    await dispatch(
      thunkUpdateChannelById(
        currentChannelsState.channels[ChannelTypes.telegram]
      )
    );
    await dispatch(
      thunkUpdateChannelById(currentChannelsState.channels[ChannelTypes.sms])
    );

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
      <h1>{campaign.name}</h1>

      <div className={styles.channels}>
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.whatsup]}
          setIsValid={setWhatsupIsValid}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.vk]}
          setIsValid={setVkIsValid}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.telegram]}
          setIsValid={setTelegramIsValid}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.sms]}
          setIsValid={setSmsIsValid}
        />
      </div>

      <button onClick={handleSave} disabled={!saveIsActive}>
        Save
      </button>
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
