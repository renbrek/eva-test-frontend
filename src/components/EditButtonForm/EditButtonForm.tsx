import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
  thunkDeleteButtonById,
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';
import { Button, Channel } from '../../store/currentChannels/types';
import { Restrictions } from '../../types/types';

import styles from './EditButtonForm.module.scss';

interface Props {
  button: Button;
  channelIndex: number;
  restrictions: Restrictions;
}

export const EditButtonForm: React.FC<Props> = ({
  button,
  channelIndex,
  restrictions,
}) => {
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector(
    (state) => state.currentChannels.channels[channelIndex]
  );

  const [isLinkButton, setIsLinkButton] = useState(button.isLinkButton);
  const [isInlineButton, setIsInlineButton] = useState(button.isInlineButton);
  const [text, setText] = useState(button.text);
  const [textIsValid, setTextIsValid] = useState(true);
  const [link, setLink] = useState(button.link);

  const buttons = useAppSelector(
    (state) => state.currentChannels.channels[channelIndex].buttons
  );

  const linkInlineButtons = currentChannel.buttons.filter(
    (btn) => btn.isLinkButton && btn.isInlineButton
  );

  const whatsupLinkSupported =
    linkInlineButtons.length < 1 || button.isLinkButton;

  const linksIsSupported =
    (currentChannel.isInlineKeyboard && restrictions.inlineLinksIsSupported) ||
    (!currentChannel.isInlineKeyboard && restrictions.standardLinksIsSupported);

  const handleIsLinkButton = () => {
    setIsLinkButton(!isLinkButton);
  };

  const handleUpdateButton = async () => {
    const channel: Channel = structuredClone(currentChannel);

    const buttonIndex = channel.buttons.findIndex(
      (btn) => btn.id === button.id
    );

    channel.buttons[buttonIndex] = {
      id: button.id,
      isInlineButton,
      isLinkButton,
      text,
      link,
      keyboardId: button.keyboardId,
    };

    await dispatch(thunkUpdateChannelById(channel));

    await dispatch(thunkFetchAllByCampaignId(currentChannel.campaignId));
  };

  const handleDeleteButton = async () => {
    if (button.id) await dispatch(thunkDeleteButtonById(button.id));
    await dispatch(thunkFetchAllByCampaignId(currentChannel.campaignId));
  };

  useEffect(() => {
    const isValid =
      (isInlineButton &&
        text.length <= restrictions.inlineMaxButtonTextLength) ||
      (isInlineButton && restrictions.inlineMaxButtonTextLength === -1) ||
      (!isInlineButton &&
        text.length <= restrictions.standardMaxButtonTextLength) ||
      (!isInlineButton && restrictions.standardMaxButtonTextLength === -1);

    setTextIsValid(isValid && text.length > 0);
  }, [text, isInlineButton]);

  return (
    <div>
      <h2>Edit Button</h2>
      {currentChannel.type !== 'whatsup' && linksIsSupported && (
        <div>
          Link button{' '}
          <input
            type="checkbox"
            checked={isLinkButton}
            onChange={handleIsLinkButton}
          />
        </div>
      )}
      {currentChannel.type === 'whatsup' &&
        whatsupLinkSupported &&
        linksIsSupported && (
          <div>
            Link button{' '}
            <input
              type="checkbox"
              checked={isLinkButton}
              onChange={handleIsLinkButton}
            />
          </div>
        )}
      <div>
        <div>Text:</div>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      {isLinkButton && (
        <div>
          <div>Link:</div>
          <input
            type="text"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </div>
      )}

      <br />
      <div className={styles.buttons}>
        <button className={styles.danger} onClick={handleDeleteButton}>
          Delete
        </button>
        <button onClick={handleUpdateButton} disabled={!textIsValid}>
          Update
        </button>
      </div>
    </div>
  );
};
