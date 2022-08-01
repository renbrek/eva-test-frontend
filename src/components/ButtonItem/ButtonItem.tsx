import React, { useState } from 'react';
import { Button } from '../../store/currentChannels/types';
import { EditButtonForm } from '../EditButtonForm/EditButtonForm';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './ButtonItem.module.scss';

interface Props {
  button: Button;
  channelIndex: number;
}

export const ButtonItem: React.FC<Props> = ({ button, channelIndex}) => {
  const [editButtonIsOpen, setEditButtonIsOpen] = useState(false);

  const handleOpenEditButtonForm = () => {
    setEditButtonIsOpen(true);
  };

  return (
    <>
      <div
        onClick={handleOpenEditButtonForm}
        className={
          button.isLinkButton
            ? `${styles.container} ${styles.linkButton}`
            : styles.container
        }
      >
        {button.text}
      </div>
      <ModalWindow active={editButtonIsOpen} setActive={setEditButtonIsOpen}>
        <EditButtonForm button={button} channelIndex={channelIndex}/>
      </ModalWindow>
    </>
  );
};
