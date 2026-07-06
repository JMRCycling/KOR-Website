import React, { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className,
  delay = 0,
  duration = 600,
  stagger = 60,
  threshold = 0.2,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: 'block' }}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${duration}ms ease`,
              transitionDelay: `${delay + wi * stagger}ms`,
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
          {wi < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.28em' }} aria-hidden="true" />
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
