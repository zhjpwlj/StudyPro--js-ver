import React, { useState } from 'react';
import { useDraggable } from '../hooks/useDraggable.js';
import { useResizable } from '../hooks/useResizable.js'; // New hook for resizing

const Widget = ({ id, children, title, initialPosition, initialSize, zIndex, onClose, onFocus, onUpdate }) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleDragStop = (finalPosition) => {
        onUpdate(id, { position: finalPosition });
    };

    const handleResizeStop = (updates) => {
        setIsResizing(false);
        onUpdate(id, { size: updates.size, position: updates.position });
    };

    // Note: `initialSize` passed to useDraggable will be stale during a resize operation.
    // This is acceptable because a drag cannot occur simultaneously with a resize.
    // When the resize is finished, the component will re-render with the new size.
    const { position: dragPosition, handleMouseDown: handleDragMouseDown, handleTouchStart: handleDragTouchStart } = useDraggable(initialPosition, { 
      onStop: handleDragStop, 
      widgetSize: initialSize 
    });

    const { size, position: resizePosition, handleMouseDown: handleResizeMouseDown, handleTouchStart: handleResizeTouchStart } = useResizable(
        initialSize,
        dragPosition,
        { 
          onStart: () => setIsResizing(true), 
          onStop: handleResizeStop 
        }
    );

    const displayPosition = isResizing ? resizePosition : dragPosition;
    const displaySize = size;

    return (
        <div
            className="widget absolute rounded-lg shadow-2xl flex flex-col"
            style={{
                top: `${displayPosition.y}px`,
                left: `${displayPosition.x}px`,
                width: `${displaySize.width}px`,
                height: `${displaySize.height}px`,
                zIndex: zIndex,
                touchAction: 'none'
            }}
            onMouseDown={() => onFocus(id)}
            onTouchStart={() => onFocus(id)}
        >
            <div 
                className="widget-header h-8 bg-black/5 dark:bg-white/5 rounded-t-lg flex items-center justify-between px-3 flex-shrink-0"
                onMouseDown={(e) => { onFocus(id