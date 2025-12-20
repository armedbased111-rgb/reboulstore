import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

/**
 * Composant carte de statistique
 * 
 * Affiche un titre, une valeur et une description
 */
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive !== false ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.positive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0 text-gray-400">{icon}</div>
        )}
      </div>
    </div>
  );
}
