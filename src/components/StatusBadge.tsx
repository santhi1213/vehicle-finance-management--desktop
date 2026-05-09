import { cn } from '@/lib/utils';

type StatusType = 'Available' | 'Sold Out' | 'Paid' | 'Pending' | 'Overdue' | 'Finance' | 'Full Payment' | 'Bike' | 'Car';

const styles: Record<string, string> = {
  Available: 'bg-success/10 text-success',
  'Sold Out': 'bg-muted text-muted-foreground',
  Paid: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Overdue: 'bg-destructive/10 text-destructive',
  Finance: 'bg-cobalt/10 text-cobalt',
  'Full Payment': 'bg-success/10 text-success',
  Bike: 'bg-cobalt/10 text-cobalt',
  Car: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider',
      styles[status] || 'bg-muted text-muted-foreground',
      className
    )}>
      {status}
    </span>
  );
}
