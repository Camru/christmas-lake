import React from 'react';
import {ButtonColor} from '../../../types/types';

import './Button.less';

type IconButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  color?: ButtonColor;
};

const IconButton = ({
  color,
  children,
  ...rest
}: IconButtonProps): JSX.Element => {
  const backgroundColor = color ? color : ButtonColor.DEFAULT;
  return (
    <button className="icon-button" {...rest} style={{backgroundColor}}>
      {children}
    </button>
  );
};

export default IconButton;
