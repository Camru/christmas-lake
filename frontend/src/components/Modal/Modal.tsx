import React, {useEffect} from 'react';
import IconButton from '../Button/IconButton';

import './Modal.css';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
};

const Modal = ({onClose, title, children}: ModalProps): JSX.Element => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h1>{title}</h1>
          <IconButton onClick={onClose}>X</IconButton>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
