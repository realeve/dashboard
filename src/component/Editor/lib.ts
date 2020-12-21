import { defaultRect } from '@/pages/config/lib';
export const getDefaultStyle = (style?: React.CSSProperties) => {
  const rect = {
    ...defaultRect,
    ...style,
  };

  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    position: 'absolute',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  } as React.CSSProperties;
};
