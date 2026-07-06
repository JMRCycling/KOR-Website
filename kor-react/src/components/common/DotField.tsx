import React from 'react';

interface DotFieldProps {
  color?: string;
  opacity?: number;
  spacing?: number;
  dotSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DotField: React.FC<DotFieldProps> = ({
  color = '255, 255, 255',
  opacity = 0.15,
  spacing = 22,
  dotSize = 1.5,
  className,
  style,
}) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: `radial-gradient(circle, rgba(${color}, ${opacity}) ${dotSize}px, transparent ${dotSize}px)`,
      backgroundSize: `${spacing}px ${spacing}px`,
      ...style,
    }}
  />
);

export default DotField;
