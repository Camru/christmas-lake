import React from 'react';

import './Button.css';

type IconButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const IconButton = ({children, ...rest}: IconButtonProps): JSX.Element => {
  return (
    <button className="icon-button" {...rest}>
      {children}
    </button>
  );
};

export default IconButton;
