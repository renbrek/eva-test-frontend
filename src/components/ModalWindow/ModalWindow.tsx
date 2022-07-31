import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

import styles from './ModalWindow.module.scss';

interface Props {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}

export const ModalWindow: React.FC<PropsWithChildren<Props>> = ({
  active,
  setActive,
  children,
}) => {
  return (
    <div
      className={
        active ? `${styles.container} ${styles.active}` : styles.container
      }
      onClick={() => {
        setActive(false);
      }}
    >
      <div
        className={
          active ? `${styles.content} ${styles.active}` : styles.content
        }
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
