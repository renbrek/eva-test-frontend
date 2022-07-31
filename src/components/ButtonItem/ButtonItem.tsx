import React from 'react';
import { Button } from '../../store/currentChannels/types';

import styles from './ButtonItem.module.scss';

interface Props {
  button: Button;
}

export const ButtonItem: React.FC<Props> = ({ button }) => {
  return (
    <div
      className={
        button.isLinkButton
          ? `${styles.container} ${styles.linkButton}`
          : styles.container
      }
    >
      {button.text}
    </div>
  );
};
