import classNames from 'classnames';
import React from 'react';
import {Colors} from '../../../types/types';

import './Button.less';

interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  onClick: () => void;
  color?: Colors;
  style?: {};
  disabled?: boolean;
  className?: string;
}

const IconButton = ({
  color: iconColor,
  className,
  children,
  style,
  ...rest
}: Partial<IconButtonProps>): JSX.Element => {
  const color = iconColor ? iconColor : Colors.LIGHT;
  return (
    <button
      className={classNames('icon-button', className)}
      {...rest}
      style={{...style, color}}>
      {children}
    </button>
  );
};

export default IconButton;
