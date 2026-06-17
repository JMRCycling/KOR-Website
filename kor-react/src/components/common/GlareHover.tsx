import React, { useRef, useState, useCallback } from 'react';

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  className,
  style,
  glareColor = '255, 255, 255',
  glareOpacity = 0.18,
  glareSize = 55,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlare(prev => ({ ...prev, active: false }));
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(${glareColor}, ${glare.active ? glareOpacity : 0}) 0%, transparent ${glareSize}%)`,
          transition: glare.active ? 'none' : 'background 0.4s ease',
          borderRadius: 'inherit',
        }}
      />
    </div>
  );
};

export default GlareHover;
