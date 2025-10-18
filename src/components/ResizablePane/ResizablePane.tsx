/**
 * ResizablePane Component
 * Provides resizable split-pane layout with draggable divider
 */

import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import styles from './ResizablePane.module.css';

interface ResizablePaneProps {
  /** Left/top pane content */
  left: ReactNode;
  /** Right/bottom pane content */
  right: ReactNode;
  /** Initial size of left pane (percentage, 0-100) */
  defaultSize?: number;
  /** Minimum size of left pane (percentage) */
  minSize?: number;
  /** Maximum size of left pane (percentage) */
  maxSize?: number;
  /** Orientation: horizontal (left-right) or vertical (top-bottom) */
  orientation?: 'horizontal' | 'vertical';
  /** Optional class name */
  className?: string;
}

export const ResizablePane: FC<ResizablePaneProps> = ({
  left,
  right,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  orientation = 'horizontal',
  className,
}) => {
  const [leftSize, setLeftSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      let newSize: number;
      if (orientation === 'horizontal') {
        const x = e.clientX - rect.left;
        newSize = (x / rect.width) * 100;
      } else {
        const y = e.clientY - rect.top;
        newSize = (y / rect.height) * 100;
      }

      // Clamp between min and max
      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setLeftSize(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minSize, maxSize, orientation]);

  const containerClass = `${styles.container} ${
    orientation === 'vertical' ? styles.vertical : styles.horizontal
  } ${className || ''}`;

  const dividerClass = `${styles.divider} ${
    orientation === 'vertical' ? styles.dividerVertical : styles.dividerHorizontal
  } ${isDragging ? styles.dividerDragging : ''}`;

  return (
    <div ref={containerRef} className={containerClass}>
      <div
        className={styles.leftPane}
        style={
          orientation === 'horizontal' ? { width: `${leftSize}%` } : { height: `${leftSize}%` }
        }
      >
        {left}
      </div>
      <div
        className={dividerClass}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation={orientation}
        aria-valuenow={leftSize}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-label={`Resize ${orientation === 'horizontal' ? 'horizontal' : 'vertical'} pane`}
        tabIndex={0}
      >
        <div className={styles.dividerHandle} />
      </div>
      <div
        className={styles.rightPane}
        style={
          orientation === 'horizontal'
            ? { width: `${100 - leftSize}%` }
            : { height: `${100 - leftSize}%` }
        }
      >
        {right}
      </div>
    </div>
  );
};

export default ResizablePane;
