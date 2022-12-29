import React, {useEffect} from 'react';
import IconButton from '../../Button/IconButton';
import ReactDOM from 'react-dom';

import './Modal.less';
import {ButtonColor} from '../../../../types/types';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
};

const OVERLAY_CLASSNAME = 'modal-overlay';

const Modal = ({onClose, title, children}: ModalProps): JSX.Element => {
  const handleClickOutside = (e: any) => {
    if (e.target.className === OVERLAY_CLASSNAME) {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={OVERLAY_CLASSNAME}>
      <div className="modal">
        <div className="modal-header">
          <h1 className="modal-header-title">{title}</h1>
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
