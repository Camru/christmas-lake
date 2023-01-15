import Box from '../Box/Box';

import './Tooltip.less';

export enum TooltipPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

type TooltipProps = {
  text: string;
  position?: TooltipPosition;
};

const Tooltip = ({text, position}: TooltipProps) => {
  const positionStyle = position === 'right' ? {right: 0} : {left: 0};
  return (
    <Box className="tooltip" style={positionStyle}>
      {text}
    </Box>
  );
};

export default Tooltip;
