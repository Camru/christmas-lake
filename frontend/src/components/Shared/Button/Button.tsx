import React from 'react';
import {Colors} from '../../../types/types';

import './Button.less';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: (e?: any) => void;
  onKeyDown?: (e?: any) => void;
  style?: {};
  type?: 'button' | 'submit' | 'reset' | undefined;
  color?: Colors;
};

const Button = ({
  color,
  children,
  disabled,
  ...rest
}: ButtonProps): JSX.Element => {
  const getBackgroundColor = () => {
    if (disabled) {
      return '';
    }

    return color ? color : Colors.LIGHT;
  };

  return (
    <button
      className="button-primary"
      disabled={disabled}
      {...rest}
      style={{backgroundColor: getBackgroundColor()}}>
      {children}
    </button>
  );
};

export default Button;
