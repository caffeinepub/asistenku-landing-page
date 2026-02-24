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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Wallet,
  ClipboardList,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  GraduationCap,
  Headphones,
  CreditCard,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  History,
  Search,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PARTNER = {
  name: "Budi Santoso",
  status: "ACTIVE",
  level: "Senior",
  skills: ["Website Dev", "Social Media"],
  bank: "BCA",
  accountNumber: "1234567890",
  accountHolder: "Budi Santoso",
  saldo: 8_500_000,
  onHold: 500_000,
};

const SUMMARY_ITEMS = [
  { label: "Task Masuk", count: 4, icon: ClipboardList, accent: "bg-teal-400/60" },
  { label: "Meminta Revisi", count: 1, icon: RotateCcw, accent: "bg-amber-400/60" },
  { label: "Dalam QA", count: 2, icon: Clock, accent: "bg-slate-400/50" },
  { label: "Selesai", count: 12, icon: CheckCircle2, accent: "bg-emerald-400/60" },
  { label: "Ditolak", count: 0, icon: XCircle, accent: "bg-rose-400/60" },
];

const MOCK_TASKS = [
  {
    id: 1,
    title: "Redesign Landing Page Produk Baru",
    service: "Website Development",
    deadline: "25 Feb 2026",
    phase: "Assigned",
    phaseColor: "bg-teal-100 text-teal-700",
  },
  {
    id: 2,
    title: "Konten Instagram Minggu Ini",
    service: "Social Media Management",
    deadline: "28 Feb 2026",
    phase: "Assigned",
    phaseColor: "bg-teal-100 text-teal-700",
  },
  {
    id: 3,
    title: "Update Artikel Blog SEO",
    service: "Content Writing",
    deadline: "1 Mar 2026",
    phase: "Assigned",
    phaseColor: "bg-teal-100 text-teal-700",
  },
  {
    id: 4,
    title: "Setup Google Ads Campaign",
    service: "Digital Marketing",
    deadline: "3 Mar 2026",
    phase: "Assigned",
    phaseColor: "bg-teal-100 text-teal-700",
  },
];

const MOCK_ON_PROGRESS = [
  {
    id: 5,
    title: "Optimasi SEO On-Page Website Klien A",
    service: "SEO Optimization",
    deadline: "27 Feb 2026",
    phase: "In Progress",
    phaseColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 6,
    title: "Pembuatan Konten Video TikTok",
    service: "Social Media Management",
    deadline: "2 Mar 2026",
    phase: "In Progress",
    phaseColor: "bg-blue-100 text-blue-700",
  },
];

const MOCK_REVISI = [
  {
    id: 7,
    title: "Revisi Desain Banner Promo",
    service: "Graphic Design",
    deadline: "26 Feb 2026",
    phase: "Revisi",
    phaseColor: "bg-orange-100 text-orange-700",
    note: "Klien meminta perubahan warna dan font heading.",
  },
];

const MOCK_QA = [
  {
    id: 8,
    title: "Audit Konten Website Klien B",
    service: "Content Writing",
    deadline: "28 Feb 2026",
    phase: "QA Review",
    phaseColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 9,
    title: "Laporan Bulanan Social Media",
    service: "Social Media Management",
    deadline: "1 Mar 2026",
    phase: "QA Review",
    phaseColor: "bg-amber-100 text-amber-700",
  },
];

const MOCK_HISTORY = [
  {
    id: 10,
    title: "Setup Email Marketing Campaign",
    service: "Digital Marketing",
    completedDate: "20 Feb 2026",
    phase: "Selesai",
    phaseColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 11,
    title: "Pembuatan Konten Blog 4 Artikel",
    service: "Content Writing",
    completedDate: "18 Feb 2026",
    phase: "Selesai",
    phaseColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 12,
    title: "Redesign Logo Brand Klien C",
    service: "Graphic Design",
    completedDate: "15 Feb 2026",
    phase: "Selesai",
    phaseColor: "bg-emerald-100 text-emerald-700",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Collapsible Section Component ───────────────────────────────────────────

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  accentColor: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  count,
  accentColor,
  isOpen,
  onToggle,
  children,
  emptyMessage = "Tidak ada task saat ini.",
  isEmpty = false,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="rounded-2xl bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out overflow-hidden">
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors duration-200"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${accentColor}`}>
                {icon}
              </div>
              <span className="text-base font-medium text-slate-800">{title}</span>
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {count}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs hidden sm:inline">{isOpen ? "Tutup" : "Lihat"}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-slate-100 px-5 pb-5 pt-4">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Search className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">{emptyMessage}</p>
              </div>
            ) : (
              children
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Task Row (reusable) ──────────────────────────────────────────────────────

interface TaskRowProps {
  title: string;
  service: string;
  dateLabel: string;
  dateValue: string;
  phase: string;
  phaseColor: string;
  accentColor?: string;
  note?: string;
  isLast?: boolean;
}

function TaskRow({
  title,
  service,
  dateLabel,
  dateValue,
  phase,
  phaseColor,
  accentColor = "bg-teal-300/60",
  note,
  isLast = false,
}: TaskRowProps) {
  return (
    <div
      className={`relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${
        !isLast ? "border-b border-slate-100 pb-4 mb-4" : ""
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-[2px] rounded-full ${accentColor}`} />
      <div className="flex-1 space-y-1 pl-4">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400">Service: {service}</p>
        <p className="text-xs text-slate-400">
          {dateLabel}: {dateValue}
        </p>
        {note && (
          <p className="text-xs text-orange-600 mt-1 italic">📝 {note}</p>
        )}
      </div>
      <div className="pl-4 sm:pl-0 flex-shrink-0">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${phaseColor}`}
        >
          {phase}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPartner() {
  const [taskFilter, setTaskFilter] = useState("All");

  // Collapsible states — each independent
  const [onProgressOpen, setOnProgressOpen] = useState(true);
  const [revisiOpen, setRevisiOpen] = useState(true);
  const [qaOpen, setQaOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  const filteredTasks =
    taskFilter === "All"
      ? MOCK_TASKS
      : taskFilter === "Assigned"
      ? MOCK_TASKS.filter((t) => t.phase === "Assigned")
      : MOCK_TASKS;

  const initials = PARTNER.name
    .split(" ")
    .map((n) => n[0])
    .join("");

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
                  <p className="text-xl font-semibold text-slate-900">
                    Halo, {PARTNER.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Siap menyelesaikan task hari ini?
                  </p>
                </div>
              </div>

              {/* Right: Status Badge + Avatar */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {PARTNER.status}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-all duration-300 ease-out hover:bg-slate-300">
                      <span className="text-sm font-semibold">{initials}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Greeting */}
            <div className="mt-3 md:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    Halo, {PARTNER.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Siap menyelesaikan task hari ini?
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {PARTNER.status}
                </span>
              </div>
            </div>
          </div>
        </header>
      }
    >
      <div className="relative min-h-screen bg-slate-50">
        {/* Soft Top Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-100/30 blur-3xl rounded-full pointer-events-none" />

        <div className="relative space-y-10">

          {/* ── Section 1: Partner Info ─────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-800">Profil Partner</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Status User */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status User</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{PARTNER.status}</p>
              </div>

              {/* Level Partner */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Star className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Level Partner</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{PARTNER.level}</p>
              </div>

              {/* Verified Skill */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-teal-50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Verified Skill</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {PARTNER.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block text-xs bg-teal-50 text-teal-700 rounded-full px-2 py-0.5 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Financial Profile */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-slate-600" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Financial Profile</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{PARTNER.bank}</p>
                <p className="text-xs text-slate-500 mt-0.5">{PARTNER.accountNumber}</p>
                <p className="text-xs text-slate-400 mt-0.5">a.n. {PARTNER.accountHolder}</p>
              </div>
            </div>
          </section>

          {/* ── Section 2: Wallet ───────────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-800">Wallet</h2>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.2)] text-white">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  {/* Saldo */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-4 w-4 text-slate-400" />
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Saldo</p>
                    </div>
                    <p className="text-2xl font-semibold text-white tracking-tight">
                      {formatRupiah(PARTNER.saldo)}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px bg-slate-700 self-stretch" />

                  {/* On Hold */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">On Hold Withdraw</p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-300 tracking-tight">
                      {formatRupiah(PARTNER.onHold)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs">
                      Minimum penarikan: Junior Rp 350.000, Senior Rp 550.000, Expert Rp 750.000.<br />
                      Proses pengajuan withdraw minimal 1x24 jam (jam kerja), maksimal 2 hari kerja setelah terkonfirmasi.
                    </p>
                  </div>
                </div>

                {/* Withdraw Button */}
                <Button
                  className="bg-white/90 backdrop-blur text-slate-900 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-white transition-all duration-300 ease-out shadow-md w-full sm:w-auto flex-shrink-0"
                  onClick={() => {
                    alert("Fitur Ajukan Withdraw akan segera tersedia!");
                  }}
                >
                  Ajukan Withdraw
                </Button>
              </div>
            </div>
          </section>

          {/* ── Section 3: Summary Cards ────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-800">Ringkasan Task</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {SUMMARY_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out"
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center mb-3 ${item.accent}`}>
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Section 4: Daftar Task (Assigned) ──────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-800">Daftar Task</h2>
              <Select value={taskFilter} onValueChange={setTaskFilter}>
                <SelectTrigger className="w-36 rounded-xl text-sm bg-white border-slate-200">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-2xl bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)] overflow-hidden">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Search className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada task tersedia.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium text-slate-900">{task.title}</h3>
                          <p className="text-xs text-slate-400">Service: {task.service}</p>
                          <p className="text-xs text-slate-400">Deadline: {task.deadline}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${task.phaseColor}`}
                          >
                            {task.phase}
                          </span>
                          <Button
                            size="sm"
                            className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 h-auto"
                          >
                            Terima
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 text-xs px-3 py-1.5 h-auto"
                          >
                            Tolak
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Section 5: On Progress ──────────────────────────────────────── */}
          <CollapsibleSection
            title="On Progress"
            icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
            count={MOCK_ON_PROGRESS.length}
            accentColor="bg-blue-100"
            isOpen={onProgressOpen}
            onToggle={() => setOnProgressOpen((v) => !v)}
            isEmpty={MOCK_ON_PROGRESS.length === 0}
          >
            {MOCK_ON_PROGRESS.map((task, idx) => (
              <TaskRow
                key={task.id}
                title={task.title}
                service={task.service}
                dateLabel="Deadline"
                dateValue={task.deadline}
                phase={task.phase}
                phaseColor={task.phaseColor}
                accentColor="bg-blue-300/60"
                isLast={idx === MOCK_ON_PROGRESS.length - 1}
              />
            ))}
          </CollapsibleSection>

          {/* ── Section 6: Revisi ───────────────────────────────────────────── */}
          <CollapsibleSection
            title="Revisi"
            icon={<RotateCcw className="h-4 w-4 text-orange-600" />}
            count={MOCK_REVISI.length}
            accentColor="bg-orange-100"
            isOpen={revisiOpen}
            onToggle={() => setRevisiOpen((v) => !v)}
            isEmpty={MOCK_REVISI.length === 0}
          >
            {MOCK_REVISI.map((task, idx) => (
              <TaskRow
                key={task.id}
                title={task.title}
                service={task.service}
                dateLabel="Deadline"
                dateValue={task.deadline}
                phase={task.phase}
                phaseColor={task.phaseColor}
                accentColor="bg-orange-300/60"
                note={task.note}
                isLast={idx === MOCK_REVISI.length - 1}
              />
            ))}
          </CollapsibleSection>

          {/* ── Section 7: Review / QA ──────────────────────────────────────── */}
          <CollapsibleSection
            title="Review / QA Asistenku"
            icon={<CheckCircle2 className="h-4 w-4 text-amber-600" />}
            count={MOCK_QA.length}
            accentColor="bg-amber-100"
            isOpen={qaOpen}
            onToggle={() => setQaOpen((v) => !v)}
            isEmpty={MOCK_QA.length === 0}
          >
            {MOCK_QA.map((task, idx) => (
              <TaskRow
                key={task.id}
                title={task.title}
                service={task.service}
                dateLabel="Deadline"
                dateValue={task.deadline}
                phase={task.phase}
                phaseColor={task.phaseColor}
                accentColor="bg-amber-300/60"
                isLast={idx === MOCK_QA.length - 1}
              />
            ))}
          </CollapsibleSection>

          {/* ── Section 8: History Task Selesai ────────────────────────────── */}
          <CollapsibleSection
            title="History Task Selesai"
            icon={<History className="h-4 w-4 text-emerald-600" />}
            count={MOCK_HISTORY.length}
            accentColor="bg-emerald-100"
            isOpen={historyOpen}
            onToggle={() => setHistoryOpen((v) => !v)}
            isEmpty={MOCK_HISTORY.length === 0}
          >
            {MOCK_HISTORY.map((task, idx) => (
              <TaskRow
                key={task.id}
                title={task.title}
                service={task.service}
                dateLabel="Selesai"
                dateValue={task.completedDate}
                phase={task.phase}
                phaseColor={task.phaseColor}
                accentColor="bg-emerald-300/60"
                isLast={idx === MOCK_HISTORY.length - 1}
              />
            ))}
          </CollapsibleSection>

          {/* ── Section 9: Akademi Coming Soon ─────────────────────────────── */}
          <section>
            <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.1)] text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Akademi Partner</h3>
                    <p className="text-sm text-teal-100 mt-0.5">
                      Tingkatkan skill dan level kamu. Segera hadir!
                    </p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 self-start sm:self-center">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </section>

          {/* ── Section 10: Hub Concierge ───────────────────────────────────── */}
          <section className="pb-4">
            <div className="rounded-2xl bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Hub Concierge</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Ada pertanyaan atau kendala? Tim kami siap membantu.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 self-start sm:self-center"
                  onClick={() =>
                    window.open("https://wa.me/6281234567890", "_blank")
                  }
                >
                  Hubungi via WhatsApp
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </DashboardShell>
  );
}
