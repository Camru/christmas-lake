import React, {useEffect} from 'react';
import IconButton from '../../Button/IconButton';
import ReactDOM from 'react-dom';

import './Modal.less';
import {ButtonColor} from '../../../../types/types';
import classNames from 'classnames';
import Box from '../Box';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactElement;
  className?: string;
};

const OVERLAY_CLASSNAME = 'modal-overlay';

const Modal = ({
  onClose,
  title,
  subtitle,
  className,
  children,
}: ModalProps): JSX.Element => {
  const handleClickOutside = (e: any) => {
    if (e.target.className === OVERLAY_CLASSNAME) {
      onClose();
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={OVERLAY_CLASSNAME}>
      <div className={classNames('modal', className)}>
        <div className="modal-header">
          <Box
            justifyContent="space-between"
            alignItems="center"
            mt="10px"
            mb="20px"
            gap={20}>
            <h1 className="modal-header-title">{title}</h1>
            {subtitle && subtitle}
          </Box>
          <IconButton onClick={onClose} color={ButtonColor.DANGER}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </IconButton>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default Modal;
