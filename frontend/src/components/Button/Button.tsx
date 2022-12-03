import React from 'react';

import './Button.less';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
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
