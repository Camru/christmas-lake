import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';

import './Notification.less';
import Box from '../Box/Box';
import {Colors} from '../../../types/types';

type NotificationProps = {
  color: Colors;
  onClose: () => void;
  children: React.ReactNode;
};

const Notification = ({
  color,
  onClose,
  children,
}: NotificationProps): JSX.Element => {
  const handleClickOutside = (e: any) => {};

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <Box className="notification" style={{backgroundColor: color}}>
      {children}
    </Box>,
    document.getElementById('notification')
  );
};

export default Notification;
