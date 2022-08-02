import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux.hooks';
import {
  setActive,
  setInline,
  setText,
} from '../../store/currentChannels/currentChannels.slice';
import { Channel } from '../../store/currentChannels/types';
import { AddButtonForm } from '../AddButtonForm/AddButtonForm';
import { ButtonItem } from '../ButtonItem/ButtonItem';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './ChannelItem.module.scss';

interface Props {
  channel: Channel;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChannelItem: React.FC<Props> = ({ channel, setIsValid }) => {
  const dispatch = useAppDispatch();

  const [index, setIndex] = useState<number | null>(null);

  const [buttonsIsSupported, setButtonsIsSupported] = useState<boolean>(false);
  const [maxMessageLength, setMaxMessageLength] = useState<number>(0);
  const [standardMaxButtonsCount, setStandardMaxButtonsCount] =
    useState<number>(0);
  const [standardMaxButtonTextLength, setStandardMaxButtonTextLength] =
    useState<number>(0);
  const [standardLinksIsSupported, setStandardLinksIsSupported] =
    useState<boolean>(false);
  const [inlineMaxButtonsCount, setInlineMaxButtonsCount] = useState<number>(0);
  const [inlineMaxButtonTextLength, setInlineMaxButtonTextLength] =
    useState<number>(0);
  const [inlineLinksIsSupported, setInlineLinksIsSupported] =
    useState<boolean>(false);

  const [isActive, setIsActive] = useState(channel.isActive);
  const [isInlineKeyboard, setIsInlineKeyboard] = useState(
    channel.isInlineKeyboard
  );

  const [message, setMessage] = useState(channel.text);
  const [messageIsValid, setMessageIsValid] = useState(true);

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

  const standardButtons = buttons.filter((btn) => !btn.isInlineButton);
  const inlineButtons = buttons.filter((btn) => btn.isInlineButton);

  const canAddStandardButton =
    standardMaxButtonsCount === -1 ||
    standardButtons.length < standardMaxButtonsCount;
  const canAddInlineButton =
    inlineMaxButtonsCount === -1 ||
    inlineButtons.length < inlineMaxButtonsCount;

  useEffect(() => {
    if (channel.type === 'whatsup') {
      setIndex(0);
      setButtonsIsSupported(true);
      setMaxMessageLength(1000);
      setStandardMaxButtonsCount(10);
      setStandardMaxButtonTextLength(20);
      setStandardLinksIsSupported(false);
      setInlineMaxButtonsCount(3);
      setInlineMaxButtonTextLength(20);
      setInlineLinksIsSupported(true);
    }
    if (channel.type === 'vk') {
      setIndex(1);
      setButtonsIsSupported(true);
      setMaxMessageLength(4096);
      setStandardMaxButtonsCount(40);
      setStandardMaxButtonTextLength(-1);
      setStandardLinksIsSupported(true);
      setInlineMaxButtonsCount(10);
      setInlineMaxButtonTextLength(-1);
      setInlineLinksIsSupported(true);
    }
    if (channel.type === 'telegram') {
      setIndex(2);
      setButtonsIsSupported(true);
      setMaxMessageLength(4096);
      setStandardMaxButtonsCount(-1);
      setStandardMaxButtonTextLength(-1);
      setStandardLinksIsSupported(false);
      setInlineMaxButtonsCount(-1);
      setInlineMaxButtonTextLength(64);
      setInlineLinksIsSupported(true);
    }
    if (channel.type === 'sms') {
      setIndex(3);
      setButtonsIsSupported(false);
      setMaxMessageLength(-1);
      setStandardMaxButtonsCount(0);
      setStandardMaxButtonTextLength(0);
      setStandardLinksIsSupported(false);
      setInlineMaxButtonsCount(0);
      setInlineMaxButtonTextLength(0);
      setInlineLinksIsSupported(false);
    }
  }, [channel.type]);

  useEffect(() => {
    if (index !== null) {
      dispatch(setText({ i: index, text: message }));
    }
  }, [message]);

  useEffect(() => {
    const isValid =
      message.length <= maxMessageLength || maxMessageLength === -1;
    setMessageIsValid(isValid);
    setIsValid(isValid);
  }, [message, maxMessageLength]);

  return (
    <>
      <div
        className={
          isActive ? styles.container : `${styles.disable} ${styles.container} `
        }
      >
        <div className={styles.header}>
          <h2>{channel.type}</h2>
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
          <div className={!messageIsValid ? styles.danger : styles.empty}>
            {message.length}
            {maxMessageLength >= 0 && `/${maxMessageLength}`}
          </div>
        </div>

        {buttonsIsSupported && (
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
                <button
                  onClick={handleAddButton}
                  disabled={
                    !(
                      (!isInlineKeyboard && canAddStandardButton) ||
                      (isInlineKeyboard && canAddInlineButton)
                    )
                  }
                >
                  Add button
                </button>
              </div>
              {isInlineKeyboard ? (
                <div className={styles.buttonsSection}>
                  {inlineButtons.map((button) => (
                    <div key={button.id} className={styles.button}>
                      {index !== null && (
                        <ButtonItem
                          key={button.id}
                          button={button}
                          restrictions={{
                            standardMaxButtonsCount,
                            standardMaxButtonTextLength,
                            standardLinksIsSupported,
                            inlineMaxButtonsCount,
                            inlineMaxButtonTextLength,
                            inlineLinksIsSupported,
                          }}
                          channelIndex={index}
                          setIsValid={setIsValid}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.buttonsSection}>
                  {standardButtons.map((button) => (
                    <div key={button.id} className={styles.button}>
                      {index !== null && (
                        <ButtonItem
                          key={button.id}
                          button={button}
                          restrictions={{
                            standardMaxButtonsCount,
                            standardMaxButtonTextLength,
                            standardLinksIsSupported,
                            inlineMaxButtonsCount,
                            inlineMaxButtonTextLength,
                            inlineLinksIsSupported,
                          }}
                          channelIndex={index}
                          setIsValid={setIsValid}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ModalWindow active={addButtonIsOpen} setActive={setAddButtonIsOpen}>
        {index !== null && (
          <AddButtonForm
            campaignId={channel.campaignId}
            index={index}
            isInlineButton={isInlineKeyboard}
            setButtons={setButtons}
            restrictions={{
              standardMaxButtonsCount,
              standardMaxButtonTextLength,
              standardLinksIsSupported,
              inlineMaxButtonsCount,
              inlineMaxButtonTextLength,
              inlineLinksIsSupported,
            }}
          />
        )}
      </ModalWindow>
    </>
  );
};
