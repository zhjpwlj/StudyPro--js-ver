import { useState, useCallback, useRef, useEffect } from 'react';

export const useResizable = (
    currentSize,
    currentPosition,
    options
) => {
    const { onStart, onStop, minSize = { width: 300, height: 200 } } = options;
    const [state, setState] = useState({ size: currentSize, position: currentPosition });
    
    const isResizingRef = useRef(false);
    const lastPointerPosition = useRef({ x: 0, y: 0 });
    const resizeDirectionRef = useRef(null);

    useEffect(() => {
        if (!isResizingRef.current) {
            setState({ size: currentSize, position: currentPosition });
        }
    }, [currentSize, currentPosition]);

    const handleMove = useCallback((clientX, clientY) => {
        if (!isResizingRef.current) return;
        
        const dx = clientX - lastPointerPosition.current.x;
        const dy = clientY - lastPointerPosition.current.y;
        
        lastPointerPosition.current = { x: clientX, y: clientY };
        
        setState(prevState => {
            const newPos = { ...prevState.position };
            const newSize = { ...prevState.size };

            switch (resizeDirectionRef.current) {
                case 'br':
                    newSize.width += dx;
                    newSize.height += dy;
                    break;
                case 'tr':
                    newSize.width += dx;
                    newSize.height -= dy;
                    break;
                case 'tl':
                    newSize.width -= dx;
                    newSize.height -= dy;
                    break;
            }

            const clampedWidth = Math.max(minSize.width, newSize.width);
            const clampedHeight = Math.max(minSize.height, newSize.height);
            
            const actualWidthChange = clampedWidth - prevState.size.width;
            const actualHeightChange = clampedHeight - prevState.size.height;

            switch(resizeDirectionRef.current) {
                case 'tr':
                    newPos.y -= actualHeightChange;
                    break;
                case 'tl':
                    newPos.x -= actualWidthChange;
                    newPos.y -= actualHeightChange;
                    break;
            }
            
            return { position: newPos, size: { width: clampedWidth, height: clampedHeight } };
        });

    }, [minSize]);

    const handleMouseMove = useCallback((e) => { handleMove(e.clientX, e.clientY); }, [handleMove]);
    const handleTouchMove = useCallback((e) => { if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY); }, [handleMove]);

    const handleEnd = useCallback(() => {
        if (isResizingRef.current) {
            isResizingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
            setState(currentState => {
                onStop(currentState);
                return currentState;
            });
        }
    }, [handleMouseMove, handleTouchMove, onStop]);

    const handleStart = useCallback((clientX, clientY, direction) => {
        onStart?.();
        isResizingRef.current = true;
        resizeDirectionRef.current = direction;
        lastPointerPosition.current = { x: clientX, y: clientY };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleEnd);
    }, [handleEnd, handleMouseMove, handleTouchMove, onStart]);

    const handleMouseDown = useCallback((e, direction) => {
        e.stopPropagation(); e.preventDefault();
        handleStart(e.clientX, e.clientY, direction);
    }, [handleStart]);

    const handleTouchStart = useCallback((e, direction) => {
        e.stopPropagation(); e.preventDefault();
        if (e.touches.length > 0) handleStart(e.touches[0].clientX, e.touches[0].clientY, direction);
    }, [handleStart]);
    
    return { size: state.size, position: state.position, handleMouseDown, handleTouchStart };
};
