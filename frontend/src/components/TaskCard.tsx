import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskStatus } from '../backend';

interface TaskCardProps {
  id: string;
  judulTask: string;
  tipeLayanan: string;
  detailTask: string;
  deadline: bigint;
  createdAt: bigint;
  status: TaskStatus;
  partnerId?: string;
  gdrive_client?: string;
  gdrive_internal?: string;
  onComplete?: (id: string) => void;
  isCompleting?: boolean;
  showCompleteButton?: boolean;
}

const statusConfig: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  [TaskStatus.open]: { label: 'Open', variant: 'secondary' },
  [TaskStatus.inProgress]: { label: 'In Progress', variant: 'default' },
  [TaskStatus.memintaReview]: { label: 'Meminta Review', variant: 'outline' },
  [TaskStatus.selesai]: { label: 'Selesai', variant: 'default' },
  [TaskStatus.cancelled]: { label: 'Cancelled', variant: 'destructive' },
};

function formatDeadline(deadline: bigint): string {
  const ms = Number(deadline) / 1_000_000;
  return new Date(ms).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TaskCard({
  id,
  judulTask,
  tipeLayanan,
  detailTask,
  deadline,
  status,
  partnerId,
  gdrive_client,
  onComplete,
  isCompleting,
  showCompleteButton,
}: TaskCardProps) {
  const config = statusConfig[status];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{tipeLayanan}</p>
          <h4 className="font-semibold text-navy-900 text-sm leading-snug truncate">{judulTask}</h4>
        </div>
        <Badge variant={config.variant} className="shrink-0 text-xs">
          {config.label}
        </Badge>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{detailTask}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Deadline: {formatDeadline(deadline)}</span>
        {partnerId && <span className="truncate max-w-[120px]">Partner: {partnerId.slice(0, 8)}…</span>}
      </div>

      {gdrive_client && (
        <a
          href={gdrive_client}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-600 hover:underline"
        >
          Lihat File Google Drive
        </a>
      )}

      {showCompleteButton && status === TaskStatus.memintaReview && onComplete && (
        <Button
          size="sm"
          onClick={() => onComplete(id)}
          disabled={isCompleting}
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs mt-1"
        >
          {isCompleting ? 'Memproses…' : 'Tandai Selesai'}
        </Button>
      )}
    </div>
  );
}
