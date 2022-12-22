type BoxProps = {
  className: string;
  m: string | number;
  p: string | number;
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems: 'normal' | 'center' | 'start' | 'end';
  justifyContent: string;
  gap: number;
  style: any;
  width: string;
  height: string;
  children: React.ReactNode;
};
const Box = ({
  m,
  p,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  width,
  height,
  style,
  children,
  ...divProps
}: Partial<BoxProps>): JSX.Element => {
  return (
    <div
      {...divProps}
      style={{
        display: 'flex',
        flexDirection: flexDirection || 'row',
        alignItems: alignItems || 'normal',
        justifyContent,
        margin: m,
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
