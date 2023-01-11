import Box from '../Box/Box';

import './Tooltip.less';

type TooltipProps = {
  text: string;
  position?: 'left' | 'right';
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
