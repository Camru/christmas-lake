import React from 'react';

import './Button.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick: (e?: any) => void;
  onKeyDown?: (e?: any) => void;
  style?: {};
  type?: 'button' | 'submit' | 'reset' | undefined;
};

const Button = ({children, ...rest}: ButtonProps): JSX.Element => {
  return (
    <button className="button-primary" {...rest}>
      {children}
    </button>
  );
};

export default Button;
