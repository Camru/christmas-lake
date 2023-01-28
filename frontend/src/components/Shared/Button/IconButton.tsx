import classNames from 'classnames';
import React, {useState} from 'react';
import {Colors} from '../../../types/types';
import Tooltip, {TooltipPosition} from '../Tooltip/Tooltip';

import './Button.less';

interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  onClick: (e?: any) => void;
  color?: Colors;
  bgColor?: Colors;
  tooltip?: {
    text: string;
    position: TooltipPosition;
  };
  style?: {};
  disabled?: boolean;
  className?: string;
}

//TODO: [cam]  handle background colors
const IconButton = ({
  color: iconColor,
  bgColor,
  className,
  children,
  tooltip,
  style,
  ...rest
}: Partial<IconButtonProps>): JSX.Element => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const color = iconColor ? iconColor : Colors.LIGHT;
  return (
    <button
      className={classNames('icon-button', className)}
      {...rest}
      style={{...style, color}}
      onPointerEnter={() => setIsTooltipOpen(true)}
      onPointerLeave={() => setIsTooltipOpen(false)}>
      {children}
      {tooltip?.text && isTooltipOpen && (
        <Tooltip text={tooltip.text} position={tooltip.position} />
      )}
    </button>
  );
};

export default IconButton;
