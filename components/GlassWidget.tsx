import React from 'react';

interface GlassWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassWidget: React.FC<GlassWidgetProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-[var(--widget-background-color)] 
        backdrop-blur-lg 
        border border-[var(--widget-border-color)] 
        rounded-2xl 
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:border-[var(--primary-accent-color)]
        hover:shadow-2xl hover:shadow-[var(--glow-color)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassWidget;
