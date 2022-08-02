import React, { useState } from 'react';
import { Button } from '../../store/currentChannels/types';
import { Restrictions } from '../../types/types';
import { EditButtonForm } from '../EditButtonForm/EditButtonForm';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import styles from './ButtonItem.module.scss';

interface Props {
  button: Button;
  channelIndex: number;
  restrictions: Restrictions;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ButtonItem: React.FC<Props> = ({
  button,
  channelIndex,
  restrictions,
  setIsValid,
}) => {
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
        <EditButtonForm
          button={button}
          channelIndex={channelIndex}
          restrictions={restrictions}
        />
      </ModalWindow>
    </>
  );
};
