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
  DialogDescription,
} from '@/components/ui/dialog';
import { LogOut, Edit } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetMyTasksAsPartner,
  usePartnerRequestsReview,
  useGetCallerUserProfile,
} from '../hooks/useQueries';
import { TaskStatus, TaskRecord } from '../backend';
import DashboardShell from '../components/layout/DashboardShell';
import { useQueryClient } from '@tanstack/react-query';

function formatDeadline(deadline: bigint): string {
  const ms = Number(deadline) / 1_000_000;
  return new Date(ms).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function TaskGroup({
  title,
  tasks,
  onRequestReview,
  isRequesting,
  requestingId,
}: {
  title: string;
  tasks: TaskRecord[];
  onRequestReview?: (id: string) => void;
  isRequesting?: boolean;
  requestingId?: string;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
        {title} ({tasks.length})
      </p>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{task.tipeLayanan}</p>
                <h4 className="font-semibold text-navy-900 text-sm truncate">{task.judulTask}</h4>
              </div>
              <Badge
                variant={
                  task.status === TaskStatus.inProgress
                    ? 'default'
                    : task.status === TaskStatus.memintaReview
                    ? 'outline'
                    : task.status === TaskStatus.selesai
                    ? 'secondary'
                    : 'secondary'
                }
                className="shrink-0 text-xs"
              >
                {task.status === TaskStatus.inProgress
                  ? 'In Progress'
                  : task.status === TaskStatus.memintaReview
                  ? 'Meminta Review'
                  : task.status === TaskStatus.selesai
                  ? 'Selesai'
                  : task.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{task.detailTask}</p>
            <p className="text-xs text-gray-400">Deadline: {formatDeadline(task.deadline)}</p>
            {task.gdrive_internal && (
              <a
                href={task.gdrive_internal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:underline"
              >
                Lihat File Internal
              </a>
            )}
            {onRequestReview && task.status === TaskStatus.inProgress && (
              <Button
                size="sm"
                onClick={() => onRequestReview(task.id)}
                disabled={isRequesting && requestingId === task.id}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs mt-1 self-start"
              >
                {isRequesting && requestingId === task.id ? 'Memproses...' : 'Minta Review'}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPartner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();

  const { data: tasks, isLoading: tasksLoading } = useGetMyTasksAsPartner();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const requestReview = usePartnerRequestsReview();

  const [requestingId, setRequestingId] = useState<string | undefined>();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleRequestReview = async (taskId: string) => {
    setRequestingId(taskId);
    try {
      await requestReview.mutateAsync(taskId);
    } catch (err) {
      console.error('Request review error:', err);
    } finally {
      setRequestingId(undefined);
    }
  };

  const allTasks = tasks ?? [];
  const openTasks = allTasks.filter((t) => t.status === TaskStatus.open);
  const inProgressTasks = allTasks.filter((t) => t.status === TaskStatus.inProgress);
  const revisiTasks = allTasks.filter((t) => t.status === TaskStatus.memintaReview);
  const selesaiTasks = allTasks.filter((t) => t.status === TaskStatus.selesai);

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8" />
        <div>
          <h1 className="font-bold text-navy-900 text-lg">Dashboard Partner</h1>
          {profileLoading ? (
            <Skeleton className="h-3 w-24 mt-1" />
          ) : (
            <p className="text-xs text-gray-400">{profile?.nama ?? 'Partner'}</p>
          )}
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
        <LogOut size={16} />
      </Button>
    </div>
  );

  return (
    <DashboardShell header={header}>
      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        {profileLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : profile ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-navy-900 text-lg">{profile.nama}</h2>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <p className="text-sm text-gray-500">{profile.whatsapp}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {profile.role}
                  </Badge>
                  <Badge
                    variant={profile.status === 'active' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {profile.status}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditDialog(true)}
                className="shrink-0"
              >
                <Edit size={14} className="mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ) : null}

        {/* Tasks */}
        {tasksLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : allTasks.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/assets/generated/task-empty-state.dim_200x200.png"
              alt="Kosong"
              className="h-24 mx-auto mb-3 opacity-50"
            />
            <p className="text-sm text-gray-400">Belum ada task yang didelegasikan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <TaskGroup
              title="Open"
              tasks={openTasks}
            />
            <TaskGroup
              title="In Progress"
              tasks={inProgressTasks}
              onRequestReview={handleRequestReview}
              isRequesting={requestReview.isPending}
              requestingId={requestingId}
            />
            <TaskGroup
              title="Meminta Review"
              tasks={revisiTasks}
            />
            <TaskGroup
              title="Selesai"
              tasks={selesaiTasks}
            />
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
            <DialogDescription>
              Untuk mengubah data profil, hubungi tim internal Asistenku.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
