import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
  addButton,
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';
import { Button, Channel } from '../../store/currentChannels/types';
import { Restrictions } from '../../types/types';

interface Props {
  index: number;
  isInlineButton: boolean;
  setButtons: React.Dispatch<React.SetStateAction<Button[]>>;
  campaignId: string;
  restrictions: Restrictions;
}

export const AddButtonForm: React.FC<Props> = ({
  index,
  isInlineButton,
  setButtons,
  campaignId,
  restrictions,
}) => {
  const dispatch = useAppDispatch();

  const currentChannelsState = useAppSelector((state) => state.currentChannels);

  const [isLinkButton, setIsLinkButton] = useState(false);
  const [text, setText] = useState('');
  const [textIsValid, setTextIsValid] = useState(true);
  const [link, setLink] = useState('');

  const buttons = useAppSelector(
    (state) => state.currentChannels.channels[index].buttons
  );

  const linkInlineButtons = currentChannelsState.channels[index].buttons.filter(
    (btn) => btn.isLinkButton && btn.isInlineButton
  );

  const whatsupLinkSupported = linkInlineButtons.length < 1;

  const linksIsSupported =
    (currentChannelsState.channels[index].isInlineKeyboard &&
      restrictions.inlineLinksIsSupported) ||
    (!currentChannelsState.channels[index].isInlineKeyboard &&
      restrictions.standardLinksIsSupported);

  const handleIsLinkButton = () => {
    setIsLinkButton(!isLinkButton);
  };

  const handleCreateButton = async () => {
    if (isLinkButton) {
      const channel: Channel = structuredClone(
        currentChannelsState.channels[index]
      );
      channel.buttons.push({
        text,
        isInlineButton,
        isLinkButton,
        link,
      });
      await dispatch(thunkUpdateChannelById(channel));
    }
    if (!isLinkButton) {
      const channel: Channel = structuredClone(
        currentChannelsState.channels[index]
      );
      channel.buttons.push({
        text,
        isInlineButton,
        isLinkButton,
      });
      await dispatch(thunkUpdateChannelById(channel));
    }

    await dispatch(thunkFetchAllByCampaignId(campaignId));
  };

  useEffect(() => {
    const isValid =
      (isInlineButton &&
        text.length <= restrictions.inlineMaxButtonTextLength) ||
      (isInlineButton && restrictions.inlineMaxButtonTextLength === -1) ||
      (!isInlineButton &&
        text.length <= restrictions.standardMaxButtonTextLength) ||
      (!isInlineButton && restrictions.standardMaxButtonTextLength === -1);

    setTextIsValid(isValid);
  }, [text, isInlineButton]);

  return (
    <div>
      <h2>Create Button</h2>
      {currentChannelsState.channels[index].type !== 'whatsup' &&
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
      {currentChannelsState.channels[index].type === 'whatsup' &&
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
      <button onClick={handleCreateButton} disabled={!textIsValid}>
        Create
      </button>
    </div>
  );
};
