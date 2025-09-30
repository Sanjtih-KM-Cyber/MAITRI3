import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '../../hooks/useDraggable';
import { View } from '../../types';

interface TacticalDialProps {
  onRoleSelect: (role: View) => void;
}

const roles = [
  { role: 'guardian', icon: 'shield', position: '-translate-y-24' },
  { role: 'coPilot', icon: 'clipboard', position: 'translate-x-24' },
  { role: 'storyteller', icon: 'book', position: 'translate-y-24' },
  { role: 'playmate', icon: 'game', position: '-translate-x-24' },
];

const icons: { [key: string]: React.ReactNode } = {
    shield: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.665-.72.948-1.114M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    clipboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    game: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17l-2 2c-2.434 2.434-6.38 2.434-8.814 0s-2.434-6.38 0-8.814L10 0l4 4-2 2-2-2-2 2zm10 0l2 2c2.434 2.434 2.434 6.38 0 8.814s-6.38 2.434-8.814 0L0 10l4-4 2 2 2-2 2 2zM5 5l2 2m12 12l-2-2" /></svg>
};

const TacticalDial: React.FC<TacticalDialProps> = ({ onRoleSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const longPressTimer = useRef<number | null>(null);

  const { position, dragHandlers, getDragMovement, isDragging } = useDraggable(
    { x: window.innerWidth - 100, y: window.innerHeight - 120 },
    { width: 64, height: 64 }
  );

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragHandlers.onMouseDown(e); // Let the hook handle starting the drag

    // Set a timer for the long press action
    longPressTimer.current = window.setTimeout(() => {
      // Only open menu if the user hasn't dragged significantly
      if (getDragMovement() <= 5) {
        setIsMenuOpen(true);
      }
      longPressTimer.current = null;
    }, 300);
  };

  const handlePressEnd = () => {
    // If the timer is still running, it means the press was too short (a tap).
    // Clear it to prevent the menu from opening after release.
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleRoleClick = (role: View) => {
    onRoleSelect(role);
    setIsMenuOpen(false);
  };

  return (
    <>
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
      <div
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="fixed top-0 left-0 z-50 flex items-center justify-center w-16 h-16"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <div className={`relative w-16 h-16 rounded-full bg-[var(--widget-background-color)] border-2 border-[var(--widget-border-color)] flex items-center justify-center transition-all duration-300 shadow-lg shadow-black/30 
          ${isMenuOpen ? 'scale-110 border-[var(--primary-accent-color)]' : 'hover:scale-105'} 
          ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab'}`}
        >
          <svg className={`w-8 h-8 text-[var(--primary-accent-color)] transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        {roles.map(({ role, icon, position: posClass }, index) => (
          <button
            key={role}
            aria-label={t(`roles.${role}`)}
            onClick={() => handleRoleClick(role as View)}
            className={`absolute w-16 h-16 rounded-full bg-[var(--widget-background-color)] border border-[var(--widget-border-color)] flex items-center justify-center text-[var(--primary-text-color)] transition-all duration-300 hover:border-[var(--primary-accent-color)] hover:text-[var(--primary-accent-color)] ${isMenuOpen ? `${posClass} opacity-100` : 'opacity-0 scale-50 pointer-events-none'}`}
            style={{ transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' }}
          >
            {icons[icon]}
          </button>
        ))}
      </div>
    </>
  );
};

export default TacticalDial;