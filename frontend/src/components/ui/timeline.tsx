import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// Types
interface TimelineContextValue {
  activeIndex: number;
}

const TimelineContext = React.createContext<TimelineContextValue>({
  activeIndex: 0,
});

// Timeline Root Component
interface TimelineProps {
  children: React.ReactNode;
  activeIndex?: number;
  className?: string;
}

export const Timeline = ({ children, activeIndex = 0, className }: TimelineProps) => {
  return (
    <TimelineContext.Provider value={{ activeIndex }}>
      <div className={cn('relative flex flex-col', className)}>{children}</div>
    </TimelineContext.Provider>
  );
};

// Timeline Item Component
interface TimelineItemProps {
  children: React.ReactNode;
  index: number;
  isLast?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const TimelineItem = ({
  children,
  index,
  isLast = false,
  icon,
  className,
}: TimelineItemProps) => {
  const { activeIndex } = React.useContext(TimelineContext);
  const isCompleted = index < activeIndex;
  const isActive = index === activeIndex;

  return (
    <div className={cn('relative flex gap-4', className)}>
      {/* Indicator Column - Largeur fixe pour alignement parfait */}
      <div className="relative flex w-10 shrink-0 flex-col items-center" style={{ minHeight: isActive ? '100px' : '60px' }}>
        {/* Circle - Centré dans la colonne */}
        <div className="relative z-10 flex items-center justify-center shrink-0">
          <TimelineIndicator isCompleted={isCompleted} isActive={isActive}>
            {icon}
          </TimelineIndicator>
        </div>

        {/* Connecting Line - Position absolue, touche le cercle en haut */}
        {!isLast && (
          <div className="absolute left-1/2 w-0.5 -translate-x-1/2" style={{ top: isActive ? '40px' : '24px', bottom: 0 }}>
            <TimelineLine isCompleted={isCompleted} />
          </div>
        )}
      </div>

      {/* Content - Hauteur minimale pour conserver les dimensions */}
      <div className="flex-1 pt-1.5" style={{ minHeight: isActive ? '100px' : '60px' }}>
        {children}
      </div>
    </div>
  );
};

// Timeline Indicator (Circle)
interface TimelineIndicatorProps {
  isCompleted: boolean;
  isActive: boolean;
  children?: React.ReactNode;
}

export const TimelineIndicator = ({
  isCompleted,
  isActive,
  children,
}: TimelineIndicatorProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative flex items-center justify-center rounded-full border-2 transition-all duration-300',
        isActive
          ? 'size-10 border-black bg-black shadow-lg'
          : isCompleted
          ? 'size-6 border-black bg-black'
          : 'size-6 border-gray-300 bg-white'
      )}
    >
      {children}
    </motion.div>
  );
};

// Timeline Line (connecting line between indicators)
interface TimelineLineProps {
  isCompleted: boolean;
}

export const TimelineLine = ({ isCompleted }: TimelineLineProps) => {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ transformOrigin: 'top' }}
      className={cn(
        'h-full w-full transition-colors duration-300',
        isCompleted ? 'bg-black' : 'bg-gray-200'
      )}
    />
  );
};

// Timeline Content Components
export const TimelineTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        'font-[Geist] font-medium text-sm uppercase tracking-tight text-black',
        className
      )}
    >
      {children}
    </h3>
  );
};

export const TimelineDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        'font-[Geist] font-light text-xs text-gray-600 leading-relaxed mt-1',
        className
      )}
    >
      {children}
    </p>
  );
};

export const TimelineDate = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <time className={cn('text-xs text-gray-500 mt-1 block', className)}>
      {children}
    </time>
  );
};

