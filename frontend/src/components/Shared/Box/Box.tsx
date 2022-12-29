type BoxProps = {
  className: string;
  m: string | number;
  mr: string | number;
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
  mr,
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
        margin: m,
        marginRight: mr,
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
