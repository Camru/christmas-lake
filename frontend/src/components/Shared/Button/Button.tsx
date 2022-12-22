import React from 'react';
import {ButtonColor} from '../../../types/types';

import './Button.less';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: (e?: any) => void;
  onKeyDown?: (e?: any) => void;
  style?: {};
  type?: 'button' | 'submit' | 'reset' | undefined;
  color?: ButtonColor;
};

const Button = ({color, children, ...rest}: ButtonProps): JSX.Element => {
  return (
    <button
      className="button-primary"
      {...rest}
      style={{backgroundColor: color ? color : ButtonColor.DEFAULT}}>
      {children}
    </button>
  );
};

export default Button;
