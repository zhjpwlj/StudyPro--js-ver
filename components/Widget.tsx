import React, { useState } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable'; // New hook for resizing
import { WidgetInstance } from '../types';

interface WidgetProps {
    id: string;
    children: React.ReactNode;
    title: string;
    initialPosition: { x: number; y: number };
    initialSize: { width: number; height: number };
    zIndex: number;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Pick<WidgetInstance, 'position' | 'size'>>) => void;
}

const Widget: React.FC<WidgetProps> = ({ id, children, title, initialPosition, initialSize, zIndex, onClose, onFocus, onUpdate }) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleDragStop = (finalPosition: { x: number; y: number }) => {
        onUpdate(id, { position: finalPosition });
    };

    const handleResizeStop = (updates: { size: { width: number; height: number }; position: { x: number; y: number } }) => {
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
            {/* Fix: Changed <header> to <div> to match the event target type expected by the useDraggable hook. */}
            <div 
                className="widget-header h-8 bg-black/5 dark:bg-white/5 rounded-t-lg flex items-center justify-between px-3 flex-shrink-0"
                onMouseDown={(e) => { onFocus(id); handleDragMouseDown(e); }}
                onTouchStart={(e) => { onFocus(id); handleDragTouchStart(e); }}
            >
                <div className="flex items-center space-x-2">
                     <button onClick={() => onClose(id)} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600"></button>
                     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize select-none">{title}</h2>
                <div className="w-16"></div>
            </div>
            <main className="flex-1 p-4 overflow-auto">
                {children}
            </main>
            <div 
                className="resize-handle-tl" 
                onMouseDown={(e) => { onFocus(id); handleResizeMouseDown(e, 'tl'); }}
                onTouchStart={(e) => { onFocus(id); handleResizeTouchStart(e, 'tl'); }}
            ></div>
             <div 
                className="resize-handle-tr" 
                onMouseDown={(e) => { onFocus(id); handleResizeMouseDown(e, 'tr'); }}
                onTouchStart={(e) => { onFocus(id); handleResizeTouchStart(e, 'tr'); }}
            ></div>
            <div 
                className="resize-handle-br" 
                onMouseDown={(e) => { onFocus(id); handleResizeMouseDown(e, 'br'); }}
                onTouchStart={(e) => { onFocus(id); handleResizeTouchStart(e, 'br'); }}
            ></div>
        </div>
    );
};

export default Widget;
