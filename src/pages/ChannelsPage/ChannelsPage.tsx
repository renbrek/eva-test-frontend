import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChannelItem } from '../../components/ChannelItem/ChannelItem';
import { Loader } from '../../components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { selectCampaignsById } from '../../store/campaigns/selectors/selectCampaignsById';
import {
  setText,
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';
import { Button } from '../../store/currentChannels/types';

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

  // const [messageWhatsup, setMessageWhatsup] = useState('');
  // const [isInlineKeyboardWhatsup, setIsInlineKeyboardWhatsup] = useState(false);
  // const [buttonsWhatsup, setButtonsWhatsup] = useState<Button[]>([]);
  // const [isActiveWhatsup, setIsActiveWhatsup] = useState<boolean>(false);

  // const [messageVk, setMessageVk] = useState('');
  // const [isInlineKeyboardVk, setIsInlineKeyboardVk] = useState(false);
  // const [buttonsVk, setButtonsVk] = useState<Button[]>([]);
  // const [isActiveVk, setIsActiveVk] = useState<boolean>(false);

  // const [messageTelegram, setMessageTelegram] = useState('');
  // const [isInlineKeyboardTelegram, setIsInlineKeyboardTelegram] =
  //   useState(false);
  // const [buttonsTelegram, setButtonsTelegram] = useState<Button[]>([]);
  // const [isActiveTelegram, setIsActiveTelegram] = useState<boolean>(false);

  // const [messageSms, setMessageSms] = useState('');
  // const [isInlineKeyboardSms, setIsInlineKeyboardSms] = useState(false);
  // const [buttonsSms, setButtonsSms] = useState<Button[]>([]);
  // const [isActiveSms, setIsActiveSms] = useState<boolean>(false);

  const { campaignId } = useParams();

  const navigate = useNavigate();

  const campaign = useAppSelector((state) =>
    selectCampaignsById(state, campaignId)
  );

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

  useEffect(() => {
    console.log(
      `text UF: ${currentChannelsState.channels[ChannelTypes.vk].text}`
    );
  });

  return isLoading ? (
    <Loader />
  ) : campaign ? (
    <div className={styles.container}>
      <div>ChannelsPage:{campaignId}</div>

      <div className={styles.channels}>
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.whatsup]}
          // setters={{
          //   setButtons: setButtonsWhatsup,
          //   setIsInlineKeyboard: setIsInlineKeyboardWhatsup,
          //   setMessage: setMessageWhatsup,
          //   setIsActive: setIsActiveWhatsup,
          // }}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.vk]}
          // setters={{
          //   setButtons: setButtonsVk,
          //   setIsInlineKeyboard: setIsInlineKeyboardVk,
          //   setMessage: setMessageVk,
          //   setIsActive: setIsActiveVk,
          // }}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.telegram]}
          // setters={{
          //   setButtons: setButtonsTelegram,
          //   setIsInlineKeyboard: setIsInlineKeyboardTelegram,
          //   setMessage: setMessageTelegram,
          //   setIsActive: setIsActiveTelegram,
          // }}
        />
        <ChannelItem
          channel={currentChannelsState.channels[ChannelTypes.sms]}
          // setters={{
          //   setButtons: setButtonsSms,
          //   setIsInlineKeyboard: setIsInlineKeyboardSms,
          //   setMessage: setMessageSms,
          //   setIsActive: setIsActiveSms,
          // }}
        />
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
