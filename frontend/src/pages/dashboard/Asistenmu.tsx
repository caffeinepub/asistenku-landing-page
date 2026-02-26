import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAllTasks } from '../../hooks/useQueries';
import { TaskStatus, TaskRecord } from '../../backend';
import DashboardShell from '../../components/layout/DashboardShell';
import DelegationForm from '../../components/DelegationForm';
import { useQueryClient } from '@tanstack/react-query';

function statusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.open: return 'Open';
    case TaskStatus.inProgress: return 'In Progress';
    case TaskStatus.memintaReview: return 'Meminta Review';
    case TaskStatus.selesai: return 'Selesai';
    case TaskStatus.cancelled: return 'Cancelled';
    default: return status;
  }
}

function statusVariant(status: TaskStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case TaskStatus.open: return 'secondary';
    case TaskStatus.inProgress: return 'default';
    case TaskStatus.memintaReview: return 'outline';
    case TaskStatus.selesai: return 'secondary';
    case TaskStatus.cancelled: return 'destructive';
    default: return 'secondary';
  }
}

function formatDeadline(deadline: bigint): string {
  const ms = Number(deadline) / 1_000_000;
  return new Date(ms).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Asistenmu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();

  const { data: tasks, isLoading: tasksLoading } = useAllTasks();
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [delegateDialogOpen, setDelegateDialogOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const openTasks = (tasks ?? []).filter((t) => t.status === TaskStatus.open);
  const inProgressTasks = (tasks ?? []).filter((t) => t.status === TaskStatus.inProgress);
  const reviewTasks = (tasks ?? []).filter((t) => t.status === TaskStatus.memintaReview);
  const doneTasks = (tasks ?? []).filter(
    (t) => t.status === TaskStatus.selesai || t.status === TaskStatus.cancelled
  );

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8" />
        <div>
          <h1 className="font-bold text-navy-900 text-lg">Asistenmu</h1>
          <p className="text-xs text-gray-400">Manajemen task & delegasi</p>
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
        <LogOut size={16} />
      </Button>
    </div>
  );

  const renderTaskGroup = (title: string, taskList: TaskRecord[], showDelegate = false) => {
    if (taskList.length === 0) return null;
    return (
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          {title} ({taskList.length})
        </p>
        <div className="space-y-3">
          {taskList.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{task.tipeLayanan}</p>
                  <h4 className="font-semibold text-navy-900 text-sm truncate">{task.judulTask}</h4>
                </div>
                <Badge variant={statusVariant(task.status)} className="shrink-0 text-xs">
                  {statusLabel(task.status)}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{task.detailTask}</p>
              <p className="text-xs text-gray-400">Deadline: {formatDeadline(task.deadline)}</p>
              {task.partnerId && (
                <p className="text-xs text-gray-400">
                  Partner: {task.partnerId.toString().slice(0, 12)}…
                </p>
              )}
              {showDelegate && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedTask(task);
                    setDelegateDialogOpen(true);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs self-start mt-1"
                >
                  Delegasikan
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardShell header={header}>
      <div className="flex flex-col gap-6">
        {tasksLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <>
            {renderTaskGroup('Open — Perlu Delegasi', openTasks, true)}
            {renderTaskGroup('In Progress', inProgressTasks)}
            {renderTaskGroup('Meminta Review', reviewTasks)}
            {renderTaskGroup('Selesai / Cancelled', doneTasks)}
            {(tasks ?? []).length === 0 && (
              <div className="text-center py-12">
                <img
                  src="/assets/generated/task-empty-state.dim_200x200.png"
                  alt="Kosong"
                  className="h-24 mx-auto mb-3 opacity-50"
                />
                <p className="text-sm text-gray-400">Belum ada task.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delegation Dialog */}
      <Dialog open={delegateDialogOpen} onOpenChange={setDelegateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delegasikan Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{selectedTask.tipeLayanan}</p>
                <p className="font-medium text-sm text-navy-900">{selectedTask.judulTask}</p>
              </div>
              <DelegationForm
                taskId={selectedTask.id}
                onSuccess={() => {
                  setDelegateDialogOpen(false);
                  setSelectedTask(null);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
