import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
  addButton,
  thunkFetchAllByCampaignId,
  thunkUpdateChannelById,
} from '../../store/currentChannels/currentChannels.slice';
import { Button, Channel } from '../../store/currentChannels/types';

interface Props {
  index: number;
  isInlineButton: boolean;
  setButtons: React.Dispatch<React.SetStateAction<Button[]>>;
  campaignId: string;
}

export const AddButtonForm: React.FC<Props> = ({
  index,
  isInlineButton,
  setButtons,
  campaignId,
}) => {
  const dispatch = useAppDispatch();

  const currentChannelsState = useAppSelector((state) => state.currentChannels);

  const [isLinkButton, setIsLinkButton] = useState(false);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');

  const buttons = useAppSelector(
    (state) => state.currentChannels.channels[index].buttons
  );

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

  const handleSetButton = () => {
    setButtons(buttons);
  };

  return (
    <div>
      <h2>Create Button</h2>
      <div>
        Link button{' '}
        <input
          type="checkbox"
          checked={isLinkButton}
          onChange={handleIsLinkButton}
        />
      </div>
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
      <button onClick={handleCreateButton}>Create</button>
      {/* <button onClick={handleSetButton}>Set</button> */}
    </div>
  );
};
