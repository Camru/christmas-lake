import React from 'react';
import {Colors} from '../../../types/types';
import Box from '../Box/Box';

import './Button.less';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  Icon?: any;
  onClick: (e?: any) => void;
  onKeyDown?: (e?: any) => void;
  style?: {};
  type?: 'button' | 'submit' | 'reset' | undefined;
  color?: Colors;
};

const Button = ({
  className,
  color,
  children,
  Icon,
  disabled,
  ...rest
}: ButtonProps): JSX.Element => {
  const getBackgroundColor = () => {
    if (disabled) {
      return '';
    }

    return color ? color : Colors.ACTION;
  };

  const buttonClass = className ? className : 'button-primary';

  if (Icon) {
    return (
      <button
        className={buttonClass}
        disabled={disabled}
        {...rest}
        style={{
          backgroundColor: getBackgroundColor(),
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
        <Icon width="12px" /> {children}
      </button>
    );
  }

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      {...rest}
      style={{backgroundColor: getBackgroundColor()}}>
      {children}
    </button>
  );
};

export default Button;
