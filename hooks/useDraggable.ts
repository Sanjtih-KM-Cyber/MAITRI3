import React, { useState, useCallback, useRef, useEffect } from 'react';

export const useDraggable = (initialPos = { x: 0, y: 0 }, elementSize = { width: 64, height: 64 }) => {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: 0, y: 0 });
  const dragMovementRef = useRef(0);

  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    // Prevent default scrolling behavior on touch devices while dragging
    if (e.cancelable) {
      e.preventDefault();
    }

    const event = 'touches' in e ? e.touches[0] : e;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;

    dragMovementRef.current = Math.abs(dx) + Math.abs(dy);

    const newX = elementStartPosRef.current.x + dx;
    const newY = elementStartPosRef.current.y + dy;

    // Constrain to viewport with a 16px margin
    const constrainedX = Math.max(16, Math.min(newX, window.innerWidth - elementSize.width - 16));
    const constrainedY = Math.max(16, Math.min(newY, window.innerHeight - elementSize.height - 16));

    requestAnimationFrame(() => {
      setPosition({ x: constrainedX, y: constrainedY });
    });
  }, [elementSize.width, elementSize.height]);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('mousemove', onDrag as EventListener);
    window.removeEventListener('touchmove', onDrag as EventListener);
    window.removeEventListener('mouseup', onDragEnd as EventListener);
    window.removeEventListener('touchend', onDragEnd as EventListener);
  }, [onDrag]);

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('button' in e && e.button !== 0) return; // Ignore right-clicks

    setIsDragging(true);
    dragMovementRef.current = 0;

    const event = 'touches' in e ? e.touches[0] : e;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    elementStartPosRef.current = { ...position };

    window.addEventListener('mousemove', onDrag as EventListener);
    window.addEventListener('touchmove', onDrag as EventListener, { passive: false });
    window.addEventListener('mouseup', onDragEnd as EventListener);
    window.addEventListener('touchend', onDragEnd as EventListener);
  }, [position, onDrag, onDragEnd]);

  // Cleanup effect to remove listeners if component unmounts while dragging
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onDrag as EventListener);
      window.removeEventListener('touchmove', onDrag as EventListener);
      window.removeEventListener('mouseup', onDragEnd as EventListener);
      window.removeEventListener('touchend', onDragEnd as EventListener);
    };
  }, [onDrag, onDragEnd]);

  // Effect to handle window resize and ensure element stays in bounds
  useEffect(() => {
    const handleResize = () => {
        setPosition(currentPos => {
            const constrainedX = Math.max(16, Math.min(currentPos.x, window.innerWidth - elementSize.width - 16));
            const constrainedY = Math.max(16, Math.min(currentPos.y, window.innerHeight - elementSize.height - 16));
            
            if (currentPos.x !== constrainedX || currentPos.y !== constrainedY) {
                return { x: constrainedX, y: constrainedY };
            }
            return currentPos;
        });
    };
    handleResize(); // Run once on mount to correct initial position
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [elementSize.width, elementSize.height]);

  const getDragMovement = () => dragMovementRef.current;

  return {
    position,
    dragHandlers: {
      onMouseDown: onDragStart,
      onTouchStart: onDragStart,
    },
    isDragging,
    getDragMovement,
  };
};
