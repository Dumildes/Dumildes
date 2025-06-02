import React, { useState, useRef, useEffect } from 'react';

interface ScrollSelectorProps {
  options: { label: string; value: number | string }[];
  value: number | string;
  onChange: (value: number | string) => void;
  itemHeight: number;
  visibleItems: number;
}

const ScrollSelector: React.FC<ScrollSelectorProps> = ({
  options,
  value,
  onChange,
  itemHeight,
  visibleItems,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = options.length * itemHeight;
  const containerHeight = visibleItems * itemHeight;
  
  const selectedIndex = options.findIndex(option => option.value === value);
  
  useEffect(() => {
    if (containerRef.current && selectedIndex !== -1) {
      const targetScrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [value, itemHeight, selectedIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    
    const index = Math.round(newScrollTop / itemHeight);
    const boundedIndex = Math.max(0, Math.min(options.length - 1, index));
    
    const newValue = options[boundedIndex]?.value;
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const delta = startY - e.clientY;
    const newScrollTop = Math.max(0, Math.min(containerRef.current.scrollTop + delta, totalHeight - containerHeight));
    containerRef.current.scrollTop = newScrollTop;
    setStartY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const delta = startY - e.touches[0].clientY;
    const newScrollTop = Math.max(0, Math.min(containerRef.current.scrollTop + delta, totalHeight - containerHeight));
    containerRef.current.scrollTop = newScrollTop;
    setStartY(e.touches[0].clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    
    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const boundedIndex = Math.max(0, Math.min(options.length - 1, index));
    const targetScrollTop = boundedIndex * itemHeight;
    
    containerRef.current.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    
    const newValue = options[boundedIndex]?.value;
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
    }
  };

  const handleTouchEnd = handleMouseUp;

  return (
    <div 
      className="relative overflow-hidden rounded-lg"
      style={{ height: `${containerHeight}px` }}
    >
      <div 
        className="absolute left-0 right-0 bg-gray-100 z-0"
        style={{ 
          height: `${itemHeight}px`, 
          top: `${Math.floor(visibleItems / 2) * itemHeight}px` 
        }}
      />
      
      <div 
        ref={containerRef}
        className="absolute top-0 left-0 right-0 overflow-y-auto scrollbar-hide"
        style={{ 
          height: `${containerHeight}px`, 
          paddingTop: `${Math.floor(visibleItems / 2) * itemHeight}px`,
          paddingBottom: `${Math.floor(visibleItems / 2) * itemHeight}px`
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {options.map((option) => (
          <div 
            key={option.value} 
            className={`flex items-center justify-center transition-colors duration-200 select-none cursor-pointer
              ${option.value === value ? 'text-black font-semibold' : 'text-gray-400'}`}
            style={{ height: `${itemHeight}px` }}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollSelector;