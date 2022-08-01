import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux.hooks';
import {
  setActive,
  setInline,
  setText,
} from '../../store/currentChannels/currentChannels.slice';
import { Button, Channel } from '../../store/currentChannels/types';
import { AddButtonForm } from '../AddButtonForm/AddButtonForm';
import { ButtonItem } from '../ButtonItem/ButtonItem';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './ChannelItem.module.scss';

interface Props {
  channel: Channel;
}

export const ChannelItem: React.FC<Props> = ({ channel }) => {
  const dispatch = useAppDispatch();

  const [index, setIndex] = useState<number | null>(null);

  const [message, setMessage] = useState(channel.text);
  const [isActive, setIsActive] = useState(channel.isActive);
  const [isInlineKeyboard, setIsInlineKeyboard] = useState(
    channel.isInlineKeyboard
  );
  const [buttons, setButtons] = useState(channel.buttons);

  const [addButtonIsOpen, setAddButtonIsOpen] = useState<boolean>(false);

  const handleAddButton = () => {
    setAddButtonIsOpen(true);
  };

  const handleActiveCheckbox = () => {
    setIsActive(!isActive);
    dispatch(setActive({ i: index, isActive: !isActive }));
  };

  const handleIsInlineKeyboard = () => {
    setIsInlineKeyboard(!isInlineKeyboard);
    dispatch(setInline({ i: index, isInline: !isInlineKeyboard }));
  };

  useEffect(() => {
    if (channel.type === 'whatsup') setIndex(0);
    if (channel.type === 'vk') setIndex(1);
    if (channel.type === 'telegram') setIndex(2);
    if (channel.type === 'sms') setIndex(3);
  }, [channel]);

  useEffect(() => {
    if (index) {
      dispatch(setText({ i: index, text: message }));
    }
  }, [message]);

  return (
    <>
      <div
        className={
          isActive ? styles.container : `${styles.disable} ${styles.container} `
        }
      >
        <div className={styles.header}>
          <h1>{channel.type}</h1>
          <div>
            {isActive ? <>active</> : <>disable</>}{' '} 
            <input
              type={'checkbox'}
              checked={isActive}
              onChange={handleActiveCheckbox}
            />
          </div>
        </div>

        <div className={styles.message}>
          Message:{' '}
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.currentTarget.value);
            }}
          ></textarea>
        </div>

        <div>
          <div>
            Keyboard: {'Inline mod '}
            <input
              type="checkbox"
              checked={isInlineKeyboard}
              onChange={handleIsInlineKeyboard}
            />
          </div>
          <div>
            <div className={styles.header}>
              Buttons
              <button onClick={handleAddButton}>Add button</button>
            </div>
            <div className={styles.buttonsSection}>
              {buttons.map((button) => (
                <div
                  key={button.id}
                  className={
                    (isInlineKeyboard && button.isInlineButton) ||
                    (!isInlineKeyboard && !button.isInlineButton)
                      ? styles.button
                      : `${styles.button} ${styles.invisible}`
                  }
                >
                  {index && (
                    <ButtonItem
                      key={button.id}
                      button={button}
                      channelIndex={index}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalWindow active={addButtonIsOpen} setActive={setAddButtonIsOpen}>
        {index && (
          <AddButtonForm
            campaignId={channel.campaignId}
            index={index}
            isInlineButton={isInlineKeyboard}
            setButtons={setButtons}
          />
        )}
      </ModalWindow>
    </>
  );
};
