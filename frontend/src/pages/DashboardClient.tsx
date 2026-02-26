import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetMyLayanan,
  useGetMyTasksAsClient,
  useCreateTask,
  useCompleteTask,
} from '../hooks/useQueries';
import { TaskStatus, TaskRecord } from '../backend';
import TaskCard from '../components/TaskCard';
import DashboardShell from '../components/layout/DashboardShell';
import { useQueryClient } from '@tanstack/react-query';

type LocalTask = {
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
};

function toLocalTask(t: TaskRecord): LocalTask {
  return {
    id: t.id,
    judulTask: t.judulTask,
    tipeLayanan: t.tipeLayanan,
    detailTask: t.detailTask,
    deadline: t.deadline,
    createdAt: t.createdAt,
    status: t.status,
    partnerId: t.partnerId?.toString(),
    gdrive_client: t.gdrive_client ?? undefined,
    gdrive_internal: t.gdrive_internal ?? undefined,
  };
}

function SectionCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-navy-900">{title}</span>
            {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default function DashboardClient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();

  const { data: layananList, isLoading: layananLoading } = useGetMyLayanan();
  const { data: tasks, isLoading: tasksLoading } = useGetMyTasksAsClient();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();

  const [taskForm, setTaskForm] = useState({
    tipeLayanan: '',
    judulTask: '',
    detailTask: '',
    deadline: '',
    gdrive_client: '',
  });
  const [createSuccess, setCreateSuccess] = useState('');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineMs = new Date(taskForm.deadline).getTime() * 1_000_000;
    try {
      await createTask.mutateAsync({
        tipeLayanan: taskForm.tipeLayanan,
        judulTask: taskForm.judulTask,
        detailTask: taskForm.detailTask,
        deadline: BigInt(deadlineMs),
        gdrive_client: taskForm.gdrive_client || undefined,
      });
      setCreateSuccess('Task berhasil dibuat!');
      setTaskForm({ tipeLayanan: '', judulTask: '', detailTask: '', deadline: '', gdrive_client: '' });
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch (err) {
      console.error('Create task error:', err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask.mutateAsync(taskId);
    } catch (err) {
      console.error('Complete task error:', err);
    }
  };

  const localTasks: LocalTask[] = (tasks ?? []).map(toLocalTask);

  const openTasks = localTasks.filter((t) => t.status === TaskStatus.open);
  const inProgressTasks = localTasks.filter((t) => t.status === TaskStatus.inProgress);
  const revisiTasks = localTasks.filter((t) => t.status === TaskStatus.memintaReview);
  const selesaiTasks = localTasks.filter((t) => t.status === TaskStatus.selesai);
  const cancelledTasks = localTasks.filter((t) => t.status === TaskStatus.cancelled);

  const totalUnits = (layananList ?? []).reduce((sum, l) => sum + Number(l.unitBalance), 0);
  const activeLayanan = (layananList ?? []).filter((l) => l.status === 'aktif').length;

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8" />
        <div>
          <h1 className="font-bold text-navy-900 text-lg">Dashboard Klien</h1>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {identity?.getPrincipal().toString().slice(0, 16)}…
          </p>
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
        <LogOut size={16} />
      </Button>
    </div>
  );

  return (
    <DashboardShell header={header}>
      <div className="flex flex-col gap-4">
        {/* Summary */}
        <SectionCard title="Ringkasan" defaultOpen>
          {layananLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-xs text-teal-600 font-medium">Unit Tersisa</p>
                <p className="text-2xl font-bold text-teal-700">{totalUnits}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Layanan Aktif</p>
                <p className="text-2xl font-bold text-navy-900">{activeLayanan}</p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Daftar Layanan */}
        <SectionCard title="Daftar Layanan">
          {layananLoading ? (
            <div className="space-y-2 pt-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : layananList && layananList.length > 0 ? (
            <div className="space-y-3 pt-2">
              {layananList.map((l) => (
                <div key={l.id.toString()} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <div>
                    <p className="font-medium text-sm text-navy-900">{l.name}</p>
                    <p className="text-xs text-gray-400">
                      {l.status === 'aktif' ? '🟢 Aktif' : '🔴 Tidak Aktif'} · Rp {Number(l.hargaPerUnit).toLocaleString('id-ID')}/unit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-teal-600">{Number(l.unitBalance)}</p>
                    <p className="text-xs text-gray-400">unit</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <img src="/assets/generated/task-empty-state.dim_200x200.png" alt="Kosong" className="h-24 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-gray-400">Belum ada layanan aktif.</p>
            </div>
          )}
        </SectionCard>

        {/* Buat Task */}
        <SectionCard title="Buat Task Baru">
          <form onSubmit={handleCreateTask} className="flex flex-col gap-4 pt-2">
            <div>
              <Label htmlFor="tipe">Tipe Layanan</Label>
              <Input
                id="tipe"
                placeholder="Contoh: Tanya Jawab, Riset..."
                value={taskForm.tipeLayanan}
                onChange={(e) => setTaskForm({ ...taskForm, tipeLayanan: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="judul">Judul Task</Label>
              <Input
                id="judul"
                placeholder="Judul singkat task Anda"
                value={taskForm.judulTask}
                onChange={(e) => setTaskForm({ ...taskForm, judulTask: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="detail">Detail Task</Label>
              <Textarea
                id="detail"
                placeholder="Jelaskan detail pekerjaan yang dibutuhkan..."
                value={taskForm.detailTask}
                onChange={(e) => setTaskForm({ ...taskForm, detailTask: e.target.value })}
                className="mt-1"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="gdrive">Link Google Drive (opsional)</Label>
              <Input
                id="gdrive"
                placeholder="https://drive.google.com/..."
                value={taskForm.gdrive_client}
                onChange={(e) => setTaskForm({ ...taskForm, gdrive_client: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={createTask.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {createTask.isPending ? 'Membuat Task...' : 'Buat Task'}
            </Button>
            {createSuccess && <p className="text-xs text-teal-600 text-center">{createSuccess}</p>}
            {createTask.isError && (
              <p className="text-xs text-red-500 text-center">Gagal membuat task. Pastikan layanan Anda aktif.</p>
            )}
          </form>
        </SectionCard>

        {/* Daftar Task */}
        <SectionCard title={`Daftar Task (${localTasks.filter(t => t.status !== TaskStatus.selesai && t.status !== TaskStatus.cancelled).length} aktif)`}>
          {tasksLoading ? (
            <div className="space-y-2 pt-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              {openTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Open ({openTasks.length})</p>
                  <div className="space-y-2">
                    {openTasks.map((t) => (
                      <TaskCard key={t.id} {...t} />
                    ))}
                  </div>
                </div>
              )}
              {inProgressTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">In Progress ({inProgressTasks.length})</p>
                  <div className="space-y-2">
                    {inProgressTasks.map((t) => (
                      <TaskCard key={t.id} {...t} />
                    ))}
                  </div>
                </div>
              )}
              {revisiTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Meminta Review ({revisiTasks.length})</p>
                  <div className="space-y-2">
                    {revisiTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        {...t}
                        showCompleteButton
                        onComplete={handleCompleteTask}
                        isCompleting={completeTask.isPending}
                      />
                    ))}
                  </div>
                </div>
              )}
              {openTasks.length === 0 && inProgressTasks.length === 0 && revisiTasks.length === 0 && (
                <div className="text-center py-8">
                  <img src="/assets/generated/task-empty-state.dim_200x200.png" alt="Kosong" className="h-24 mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-gray-400">Tidak ada task aktif.</p>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* History */}
        <SectionCard title={`History (${selesaiTasks.length + cancelledTasks.length})`}>
          {tasksLoading ? (
            <div className="space-y-2 pt-2">
              <Skeleton className="h-20 w-full" />
            </div>
          ) : selesaiTasks.length === 0 && cancelledTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada history task.</p>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              {selesaiTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Selesai ({selesaiTasks.length})</p>
                  <div className="space-y-2">
                    {selesaiTasks.map((t) => (
                      <TaskCard key={t.id} {...t} />
                    ))}
                  </div>
                </div>
              )}
              {cancelledTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Cancelled ({cancelledTasks.length})</p>
                  <div className="space-y-2">
                    {cancelledTasks.map((t) => (
                      <TaskCard key={t.id} {...t} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
