import React from 'react';
import {ButtonColor} from '../../../types/types';

import './Button.less';

interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  onClick: () => void;
  color?: ButtonColor;
}

const IconButton = ({
  color: iconColor,
  children,
  ...rest
}: Partial<IconButtonProps>): JSX.Element => {
  const color = iconColor ? iconColor : ButtonColor.LIGHT;
  return (
    <button className="icon-button" {...rest} style={{color}}>
      {children}
    </button>
  );
};

export default IconButton;
