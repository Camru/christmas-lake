type BoxProps = {
  className: string;
  m: string | number;
  mt: string | number;
  mr: string | number;
  mb: string | number;
  ml: string | number;
  p: string | number;
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems: 'normal' | 'center' | 'start' | 'end';
  justifyContent: string;
  flexWrap: 'wrap';
  gap: number;
  style: any;
  width: string;
  height: string;
  position: string;
  children: React.ReactNode;
};
const Box = ({
  m,
  mt,
  mr,
  mb,
  ml,
  p,
  flexDirection,
  alignItems,
  justifyContent,
  flexWrap,
  gap,
  width,
  height,
  style,
  position,
  children,
  ...divProps
}: Partial<BoxProps>): JSX.Element => {
  const getMargin = () => {
    if (m) {
      return m;
    }

    const top = mt || '0';
    const right = mr || '0';
    const bottom = mb || '0';
    const left = ml || '0';

    return `${top} ${right} ${bottom} ${left}`;
  };

  return (
    <div
      {...divProps}
      style={{
        position,
        display: 'flex',
        flexDirection: flexDirection || 'row',
        alignItems: alignItems || 'normal',
        justifyContent,
        flexWrap: flexWrap || 'nowrap',
        margin: getMargin(),
        padding: p,
        gap,
        width,
        height,
        ...style,
      }}>
      {children}
    </div>
  );
};

export default Box;
