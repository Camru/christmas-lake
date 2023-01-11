import React, {useEffect} from 'react';
import IconButton from '../Button/IconButton';
import ReactDOM from 'react-dom';

import './Modal.less';
import {Colors} from '../../../types/types';
import classNames from 'classnames';
import Box from '../Box/Box';

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
          <IconButton onClick={onClose} color={Colors.LIGHT}>
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
                d="M6 18L18 6M6 6l12 12"
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
