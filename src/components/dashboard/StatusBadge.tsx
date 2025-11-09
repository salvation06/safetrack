import { RiskState } from '@/types/monitoring';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  state: RiskState;
  className?: string;
}

export const StatusBadge = ({ state, className }: StatusBadgeProps) => {
  const config = {
    SAFE: {
      bg: 'bg-statusSafeBg',
      text: 'text-statusSafe',
      label: 'Safe',
    },
    WATCH: {
      bg: 'bg-statusWatchBg',
      text: 'text-statusWatch',
      label: 'Watch',
    },
    ALERT: {
      bg: 'bg-statusAlertBg',
      text: 'text-statusAlert',
      label: 'Alert',
    },
    CRITICAL: {
      bg: 'bg-statusCriticalBg animate-pulse',
      text: 'text-statusCritical',
      label: 'Critical',
    },
  };

  const { bg, text, label } = config[state] || config.SAFE;

  return (
    <div className={cn('inline-flex items-center px-3 py-1.5 rounded-full font-semibold text-sm', bg, text, className)}>
      <div className={cn('w-2 h-2 rounded-full mr-2', text.replace('text-', 'bg-'))} />
      {label}
    </div>
  );
};
