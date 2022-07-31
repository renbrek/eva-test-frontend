import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux.hooks';
import { setText } from '../../store/currentChannels/currentChannels.slice';
import { Channel } from '../../store/currentChannels/types';
import { AddButtonForm } from '../AddButtonForm/AddButtonForm';
import { ButtonItem } from '../ButtonItem/ButtonItem';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './ChannelItem.module.scss';

interface Props {
  channel: Channel;
}

enum ChannelTypes {
  whatsup,
  vk,
  telegram,
  sms,
}

export const ChannelItem: React.FC<Props> = ({ channel }) => {
  const dispatch = useAppDispatch();
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
  };

  const handleIsInlineKeyboard = () => {
    setIsInlineKeyboard(!isInlineKeyboard);
  };

  // useEffect(() => {
  //   dispatch(setText({ i: 0, text: message }));
  // }, [message]);

  return (
    <>
      {' '}
      <div
        className={
          isActive ? styles.container : `${styles.disable} ${styles.container} `
        }
      >
        <div className={styles.header}>
          <h1>{channel.type}</h1>
          <input
            type={'checkbox'}
            checked={isActive}
            onChange={handleActiveCheckbox}
          />
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
                  <ButtonItem key={button.id} button={button} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalWindow active={addButtonIsOpen} setActive={setAddButtonIsOpen}>
        <AddButtonForm />
      </ModalWindow>
    </>
  );
};
