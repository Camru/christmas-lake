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
  flexWrap: 'wrap' | 'nowrap';
  gap: number;
  style: any;
  width: string;
  height: string;
  position: string;
  children: React.ReactNode;
};

const getPixels = (prop: string | number | undefined) => {
  if (prop === undefined) {
    return '0';
  }

  if (typeof prop === 'number') {
    return `${prop}px`;
  }

  return prop;
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

    const top = getPixels(mt);
    const right = getPixels(mr);
    const bottom = getPixels(mb);
    const left = getPixels(ml);

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
