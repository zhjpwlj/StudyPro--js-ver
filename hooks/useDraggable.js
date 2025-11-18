import { useState, useCallback, useRef } from 'react';
import { WIDGET_HEADER_HEIGHT, DOCK_AREA_HEIGHT } from '../constants.js';

export const useDraggable = (
    initialPosition,
    options
) => {
    const { onStop, widgetSize } = options;
    const [position, setPosition] = useState(initialPosition);
    const elementOffsetRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const containerRef = useRef(null);

    const handleMove = useCallback((clientX, clientY) => {
        if (!isDraggingRef.current || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        
        let newX = clientX - containerRect.left - elementOffsetRef.current.x;
        let newY = clientY - containerRect.top - elementOffsetRef.current.y;

        // Boundary check
        newX = Math.max(0, Math.min(newX, containerRect.width - widgetSize.width));

        const maxY = containerRect.height - WIDGET_HEADER_HEIGHT - DOCK_AREA_HEIGHT;
        newY = Math.max(0, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
    }, [widgetSize]);

    const handleMouseMove = useCallback((e) => {
        handleMove(e.clientX, e.clientY);
    }, [handleMove]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleMove]);

    const handleEnd = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
            setPosition(currentPos => {
                onStop(currentPos);
                return currentPos;
            });
        }
    }, [handleMouseMove, handleTouchMove, onStop]);

    const handleStart = useCallback((clientX, clientY) => {
        if (!containerRef.current) {
            containerRef.current = document.getElementById('desktop-container');
        }
        if (!containerRef.current) return;

        isDraggingRef.current = true;

        const containerRect = containerRef.current.getBoundingClientRect();
        elementOffsetRef.current = {
            x: clientX - containerRect.left - position.x,
            y: clientY - containerRect.top - position.y,
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleEnd);
    }, [handleEnd, handleMouseMove, handleTouchMove, position.x, position.y]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
    }, [handleStart]);

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleStart]);

    return { position, handleMouseDown, handleTouchStart };
};
