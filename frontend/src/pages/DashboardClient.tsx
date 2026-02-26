import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Wrench,
  History,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { useGetMyLayanan, useCreateTask } from "@/hooks/useQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { LayananStatus, Task } from "@/backend";

// ─── Types ────────────────────────────────────────────────────────────────
type TaskStatus = "review" | "revisi" | "on_progress" | "qa_asistenmu" | "selesai";

interface LocalTask extends Task {
  status: TaskStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDeadline(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

// ─── Sub-components ───────────────────────────────────────────────────────

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accentColor?: string;
}

function CollapsibleCard({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
  accentColor = "bg-slate-900",
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-2xl bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-6 py-5 text-left group">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg ${accentColor} flex items-center justify-center text-white`}>
                {icon}
              </div>
              <span className="text-base font-semibold text-slate-800">{title}</span>
              {badge}
            </div>
            <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
              {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 border-t border-slate-50">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface TaskItemProps {
  task: LocalTask;
  defaultOpen?: boolean;
}

function TaskItem({ task, defaultOpen = false }: TaskItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const accentMap: Record<TaskStatus, string> = {
    review: "bg-amber-400",
    revisi: "bg-orange-400",
    on_progress: "bg-slate-400",
    qa_asistenmu: "bg-violet-400",
    selesai: "bg-emerald-400",
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="relative rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden">
        <div className={`absolute left-0 top-0 h-full w-1 ${accentMap[task.status]}`} />
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 pl-5 text-left hover:bg-slate-50 transition-colors">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm font-medium text-slate-800 truncate">{task.judulTask}</p>
              <p className="text-xs text-slate-400 mt-0.5">{task.tipeLayanan}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 hidden sm:block">
                {formatDate(task.deadline)}
              </span>
              {open ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-4 pt-1 border-t border-slate-100 space-y-2">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Detail Task</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{task.detailTask}</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <div>
                <p className="text-xs font-medium text-slate-500">Deadline</p>
                <p className="text-sm text-slate-700">{formatDate(task.deadline)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Dibuat</p>
                <p className="text-sm text-slate-700">{formatDate(task.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">ID Task</p>
                <p className="text-sm text-slate-700 font-mono">#{task.id}</p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface TaskStatusCardProps {
  title: string;
  icon: React.ReactNode;
  status: TaskStatus;
  tasks: LocalTask[];
  accentColor: string;
  badgeColor: string;
}

function TaskStatusCard({ title, icon, status, tasks, accentColor, badgeColor }: TaskStatusCardProps) {
  const filtered = tasks.filter((t) => t.status === status);

  return (
    <CollapsibleCard
      title={title}
      icon={icon}
      accentColor={accentColor}
      badge={
        filtered.length > 0 ? (
          <span className={`ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold text-white ${badgeColor}`}>
            {filtered.length}
          </span>
        ) : undefined
      }
    >
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <img
            src="/assets/generated/task-empty-state.dim_200x200.png"
            alt="Tidak ada task"
            className="h-20 w-20 opacity-50"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="text-sm text-slate-400">Tidak ada task {title.toLowerCase()}</p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {filtered.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </CollapsibleCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function DashboardClient() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  // Form state
  const [selectedLayananId, setSelectedLayananId] = useState<string>("");
  const [judulTask, setJudulTask] = useState("");
  const [detailTask, setDetailTask] = useState("");
  const [deadlineStr, setDeadlineStr] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Local tasks storage (since backend doesn't persist/query tasks yet)
  const [localTasks, setLocalTasks] = useState<LocalTask[]>([]);

  // Backend hooks
  const { data: layananList = [], isLoading: layananLoading } = useGetMyLayanan();
  const createTaskMutation = useCreateTask();

  const activeLayanan = layananList.filter((l) => l.status === LayananStatus.aktif);
  const hasActiveLayanan = activeLayanan.length > 0;

  const userName = identity?.getPrincipal().toString().slice(0, 8) + "...";

  // Summary counts
  const statusCounts = {
    review: localTasks.filter((t) => t.status === "review").length,
    revisi: localTasks.filter((t) => t.status === "revisi").length,
    on_progress: localTasks.filter((t) => t.status === "on_progress").length,
    qa_asistenmu: localTasks.filter((t) => t.status === "qa_asistenmu").length,
    selesai: localTasks.filter((t) => t.status === "selesai").length,
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleCreateTask = async () => {
    setFormError("");
    setFormSuccess("");

    if (!judulTask.trim()) {
      setFormError("Judul task wajib diisi.");
      return;
    }
    if (!detailTask.trim()) {
      setFormError("Detail task wajib diisi.");
      return;
    }
    if (!deadlineStr) {
      setFormError("Deadline wajib diisi.");
      return;
    }

    const tipeLayanan =
      activeLayanan.length === 1
        ? activeLayanan[0].name
        : activeLayanan.find((l) => l.id.toString() === selectedLayananId)?.name ?? "";

    if (!tipeLayanan) {
      setFormError("Pilih layanan terlebih dahulu.");
      return;
    }

    try {
      const deadlineBigInt = formatDeadline(deadlineStr);
      const task = await createTaskMutation.mutateAsync({
        tipeLayanan,
        judulTask: judulTask.trim(),
        detailTask: detailTask.trim(),
        deadline: deadlineBigInt,
      });

      // Store locally with default status "on_progress"
      const localTask: LocalTask = {
        ...task,
        status: "on_progress",
      };
      setLocalTasks((prev) => [localTask, ...prev]);

      setFormSuccess("Task berhasil dibuat! Asistenmu akan segera menghubungi kamu.");
      setJudulTask("");
      setDetailTask("");
      setDeadlineStr("");
      setSelectedLayananId("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat task.";
      setFormError(msg);
    }
  };

  // History: derive from localTasks sorted by createdAt desc
  const historyItems = [...localTasks]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 20)
    .map((t) => ({
      id: t.id,
      text: `Task "${t.judulTask}" dibuat`,
      time: formatDate(t.createdAt),
      tipe: t.tipeLayanan,
    }));

  return (
    <DashboardShell
      header={
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Left: Logo + Greeting */}
              <div className="flex items-center gap-4">
                <img
                  src="/assets/asistenku-horizontal.png"
                  alt="Asistenku"
                  className="h-8 w-auto"
                />
                <div className="hidden md:block">
                  <p className="text-base font-semibold text-slate-900">
                    Ruang Kerja Kamu
                  </p>
                  <p className="text-xs text-slate-400">
                    Delegasikan, pantau, dan selesaikan bersama Asistenmu
                  </p>
                </div>
              </div>

              {/* Right: Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 text-xs font-bold">
                    AK
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                  <DropdownMenuItem className="cursor-pointer text-sm text-slate-600">
                    {userName}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-sm text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      }
    >
      <div className="relative min-h-screen">
        {/* Soft Top Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-100/30 blur-3xl rounded-full pointer-events-none" />

        <div className="relative space-y-5">

          {/* ── Summary Card ─────────────────────────────────────────── */}
          <CollapsibleCard
            title="Summary"
            icon={<LayoutDashboard className="h-4 w-4" />}
            accentColor="bg-slate-800"
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Meminta Review", count: statusCounts.review, color: "text-amber-500", bg: "bg-amber-50" },
                { label: "On Revisi", count: statusCounts.revisi, color: "text-orange-500", bg: "bg-orange-50" },
                { label: "On Progress", count: statusCounts.on_progress, color: "text-slate-600", bg: "bg-slate-100" },
                { label: "QA Asistenmu", count: statusCounts.qa_asistenmu, color: "text-violet-500", bg: "bg-violet-50" },
                { label: "Selesai", count: statusCounts.selesai, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center justify-center rounded-xl ${item.bg} p-4`}
                >
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-xs text-slate-500 text-center mt-1 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          {/* ── Daftar Layanan ───────────────────────────────────────── */}
          <CollapsibleCard
            title="Daftar Layanan Kamu"
            icon={<ClipboardList className="h-4 w-4" />}
            accentColor="bg-teal-600"
            defaultOpen={true}
            badge={
              layananList.length > 0 ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {layananList.length}
                </Badge>
              ) : undefined
            }
          >
            {layananLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : layananList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <p className="text-sm text-slate-400">Belum ada layanan aktif.</p>
                <p className="text-xs text-slate-300">Hubungi Concierge untuk aktivasi layanan.</p>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {layananList.map((layanan) => (
                  <div
                    key={layanan.id.toString()}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">{layanan.name}</p>
                      <p className="text-xs text-slate-400 font-mono">ID: {layanan.id.toString()}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        layanan.status === LayananStatus.aktif
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {layanan.status === LayananStatus.aktif ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleCard>

          {/* ── Buat Task ────────────────────────────────────────────── */}
          <CollapsibleCard
            title="Buat Task Baru"
            icon={<Plus className="h-4 w-4" />}
            accentColor={hasActiveLayanan ? "bg-navy-700" : "bg-slate-300"}
            defaultOpen={false}
          >
            {!hasActiveLayanan ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <AlertCircle className="h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-400 text-center">
                  Kamu belum memiliki layanan aktif.
                </p>
                <p className="text-xs text-slate-300 text-center">
                  Hubungi Concierge untuk mengaktifkan layanan terlebih dahulu.
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {/* Dropdown layanan — hanya tampil jika lebih dari 1 */}
                {activeLayanan.length > 1 && (
                  <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">Pilih Layanan</Label>
                    <Select value={selectedLayananId} onValueChange={setSelectedLayananId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih layanan aktif..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeLayanan.map((l) => (
                          <SelectItem key={l.id.toString()} value={l.id.toString()}>
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Judul Task */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-slate-600">Judul Task</Label>
                  <Input
                    placeholder="Masukkan judul task..."
                    value={judulTask}
                    onChange={(e) => setJudulTask(e.target.value)}
                  />
                </div>

                {/* Detail Task */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-slate-600">Detail Task</Label>
                  <Textarea
                    placeholder="Jelaskan detail task yang ingin dikerjakan..."
                    rows={4}
                    value={detailTask}
                    onChange={(e) => setDetailTask(e.target.value)}
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-slate-600">Deadline</Label>
                  <Input
                    type="date"
                    value={deadlineStr}
                    onChange={(e) => setDeadlineStr(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Error / Success */}
                {formError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {formSuccess}
                  </div>
                )}

                {/* Submit */}
                <Button
                  className="w-full bg-slate-900 text-white rounded-xl py-5 text-sm font-medium hover:bg-slate-800 transition-all"
                  onClick={handleCreateTask}
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    "Buat Permintaan ke Asistenmu"
                  )}
                </Button>
              </div>
            )}
          </CollapsibleCard>

          {/* ── Daftar Task Kamu ─────────────────────────────────────── */}
          <CollapsibleCard
            title="Daftar Task Kamu"
            icon={<Search className="h-4 w-4" />}
            accentColor="bg-slate-700"
            defaultOpen={true}
            badge={
              localTasks.length > 0 ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {localTasks.length}
                </Badge>
              ) : undefined
            }
          >
            <div className="space-y-3 mt-4">
              {/* Meminta Review */}
              <TaskStatusCard
                title="Meminta Review"
                icon={<Search className="h-3.5 w-3.5" />}
                status="review"
                tasks={localTasks}
                accentColor="bg-amber-500"
                badgeColor="bg-amber-500"
              />

              {/* On Revisi */}
              <TaskStatusCard
                title="Task on Revisi"
                icon={<AlertCircle className="h-3.5 w-3.5" />}
                status="revisi"
                tasks={localTasks}
                accentColor="bg-orange-500"
                badgeColor="bg-orange-500"
              />

              {/* On Progress */}
              <TaskStatusCard
                title="Task on Progress"
                icon={<Clock className="h-3.5 w-3.5" />}
                status="on_progress"
                tasks={localTasks}
                accentColor="bg-slate-500"
                badgeColor="bg-slate-500"
              />

              {/* QA Asistenmu */}
              <TaskStatusCard
                title="Task QA Asistenmu"
                icon={<Wrench className="h-3.5 w-3.5" />}
                status="qa_asistenmu"
                tasks={localTasks}
                accentColor="bg-violet-500"
                badgeColor="bg-violet-500"
              />

              {/* Selesai */}
              <TaskStatusCard
                title="Task Selesai"
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                status="selesai"
                tasks={localTasks}
                accentColor="bg-emerald-500"
                badgeColor="bg-emerald-500"
              />
            </div>
          </CollapsibleCard>

          {/* ── History ──────────────────────────────────────────────── */}
          <CollapsibleCard
            title="History Aktivitas"
            icon={<History className="h-4 w-4" />}
            accentColor="bg-slate-600"
            defaultOpen={false}
          >
            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <History className="h-8 w-8 text-slate-200" />
                <p className="text-sm text-slate-400">Belum ada aktivitas.</p>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-teal-400 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">{item.text}</p>
                        <p className="text-xs text-slate-400">{item.tipe}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-3">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleCard>

          {/* ── Concierge Contact ────────────────────────────────────── */}
          <section>
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.2)]">
              <p className="text-center text-sm text-slate-200">
                Butuh bantuan? Hubungi Concierge Asistenku
              </p>
              <a
                href="https://wa.me/628817743613"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white/90 backdrop-blur text-slate-900 rounded-xl px-5 py-2 text-sm font-medium hover:bg-white transition">
                  Hubungi via WhatsApp
                </Button>
              </a>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
