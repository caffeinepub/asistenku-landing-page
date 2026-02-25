import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Mail,
  Calendar,
  User,
  AlertCircle,
  Layers,
} from "lucide-react";

// ─── AdminUser interfaces & mock data ─────────────────────────────────────────

interface UserItem {
  idUser: string;
  name: string;
  role: "Client" | "Internal" | "Partner";
  status: "Pending" | "Aktif" | "Suspended";
  verifiedSkill?: string[];
  levelPartner?: string;
  principalId: string;
  assignedRole?: string;
}

interface TicketItem {
  id: string;
  userId: string;
  notes: string;
  status: string;
}

interface HistoryItem {
  id: string;
  userId: string;
  action: string;
  tanggal: string;
}

async function fetchUsers(): Promise<UserItem[]> {
  return [
    {
      idUser: "U001",
      name: "Budi Santoso",
      role: "Client",
      status: "Aktif",
      verifiedSkill: [],
      principalId: "aaaaa-bbbbb-ccccc-00001",
    },
    {
      idUser: "U002",
      name: "Siti Rahayu",
      role: "Partner",
      status: "Aktif",
      verifiedSkill: ["Design", "Copywriting"],
      levelPartner: "Silver",
      principalId: "aaaaa-bbbbb-ccccc-00002",
    },
    {
      idUser: "U003",
      name: "Ahmad Fauzi",
      role: "Client",
      status: "Pending",
      verifiedSkill: [],
      principalId: "aaaaa-bbbbb-ccccc-00003",
    },
    {
      idUser: "U004",
      name: "Dewi Lestari",
      role: "Internal",
      status: "Aktif",
      verifiedSkill: [],
      assignedRole: "AdminFinance",
      principalId: "aaaaa-bbbbb-ccccc-00004",
    },
    {
      idUser: "U005",
      name: "Rudi Hermawan",
      role: "Partner",
      status: "Suspended",
      verifiedSkill: ["SEO", "Content"],
      levelPartner: "Bronze",
      principalId: "aaaaa-bbbbb-ccccc-00005",
    },
    {
      idUser: "U006",
      name: "Maya Putri",
      role: "Internal",
      status: "Pending",
      verifiedSkill: [],
      principalId: "aaaaa-bbbbb-ccccc-00006",
    },
    {
      idUser: "U007",
      name: "Hendra Wijaya",
      role: "Partner",
      status: "Pending",
      verifiedSkill: [],
      principalId: "aaaaa-bbbbb-ccccc-00007",
    },
    {
      idUser: "U008",
      name: "Rina Kusuma",
      role: "Internal",
      status: "Aktif",
      verifiedSkill: [],
      assignedRole: "Asistenmu",
      principalId: "aaaaa-bbbbb-ccccc-00008",
    },
    {
      idUser: "U009",
      name: "Fajar Nugroho",
      role: "Internal",
      status: "Aktif",
      verifiedSkill: [],
      assignedRole: "Concierge",
      principalId: "aaaaa-bbbbb-ccccc-00009",
    },
  ];
}

async function fetchTickets(): Promise<TicketItem[]> {
  return [
    { id: "T001", userId: "U001", notes: "Tidak bisa login ke dashboard", status: "Masuk" },
    { id: "T002", userId: "U002", notes: "Pembayaran gagal diproses", status: "Proses" },
    { id: "T003", userId: "U003", notes: "Data pendaftaran tidak tersimpan", status: "Masuk" },
    { id: "T004", userId: "U004", notes: "Akun terkunci setelah reset password", status: "Selesai" },
  ];
}

async function fetchHistory(): Promise<HistoryItem[]> {
  return [
    { id: "H001", userId: "U001", action: "User Registered sebagai Client", tanggal: "2024-03-15" },
    { id: "H002", userId: "U004", action: "Tiket T004 diselesaikan", tanggal: "2024-03-14" },
    { id: "H003", userId: "U002", action: "Partner diaktifkan", tanggal: "2024-03-13" },
    { id: "H004", userId: "U005", action: "User disuspend oleh Admin", tanggal: "2024-03-12" },
  ];
}

// ─── Finance mock data ────────────────────────────────────────────────────────

const mockFinanceSummary = {
  gmvTotal: "Rp 125.500.000",
  gmvTenang: "Rp 30.000.000",
  gmvRapi: "Rp 25.500.000",
  gmvFokus: "Rp 28.000.000",
  gmvJaga: "Rp 22.000.000",
  gmvEfisien: "Rp 20.000.000",
  margin: "Rp 18.825.000",
  layananAktif: 42,
  pendingWithdraw: 5,
  pendingPerubahan: 3,
};

const mockWithdrawRequests = [
  { id: "W001", partner: "Ahmad Fauzi", amount: "Rp 2.500.000", bank: "BCA - 1234567890", date: "2024-03-15", status: "Pending" },
  { id: "W002", partner: "Dewi Lestari", amount: "Rp 1.750.000", bank: "Mandiri - 0987654321", date: "2024-03-14", status: "Pending" },
  { id: "W003", partner: "Rudi Hermawan", amount: "Rp 3.200.000", bank: "BNI - 1122334455", date: "2024-03-13", status: "Approved" },
];

const mockPerubahanData = [
  {
    id: "PD001",
    partner: "Ahmad Fauzi",
    field: "Nomor Rekening",
    lama: "BCA - 1234567890",
    baru: "BCA - 0987654321",
    date: "2024-03-15",
    status: "Pending",
  },
  {
    id: "PD002",
    partner: "Dewi Lestari",
    field: "Nama Bank",
    lama: "Mandiri",
    baru: "BCA",
    date: "2024-03-14",
    status: "Pending",
  },
  {
    id: "PD003",
    partner: "Rudi Hermawan",
    field: "Nomor Rekening",
    lama: "BNI - 1122334455",
    baru: "BNI - 5544332211",
    date: "2024-03-13",
    status: "Approved",
  },
];

const mockFinanceTickets = [
  { id: "FT001", user: "PT Maju Bersama", subject: "Invoice tidak sesuai", status: "Masuk", date: "2024-03-15" },
  { id: "FT002", user: "CV Sejahtera", subject: "Pembayaran belum terkonfirmasi", status: "Proses", date: "2024-03-14" },
  { id: "FT003", user: "Ahmad Fauzi", subject: "Withdraw belum cair", status: "Masuk", date: "2024-03-13" },
];

// ─── Extended client list for autocomplete ────────────────────────────────────

interface ClientExtended {
  idUser: string;
  name: string;
  principalId: string;
}

const mockClientsExtended: ClientExtended[] = [
  { idUser: "C001", name: "Client A", principalId: "xxxxx-yyyyy-zzzzz-00001" },
  { idUser: "C002", name: "Client B", principalId: "xxxxx-yyyyy-zzzzz-00002" },
  { idUser: "C003", name: "PT Maju Jaya", principalId: "xxxxx-yyyyy-zzzzz-00003" },
  { idUser: "C004", name: "CV Berkah Abadi", principalId: "xxxxx-yyyyy-zzzzz-00004" },
  { idUser: "C005", name: "Budi Santoso", principalId: "aaaaa-bbbbb-ccccc-00001" },
];

// ─── Aktivasi Layanan interfaces & mock functions ─────────────────────────────

interface Client {
  idUser: string;
  name: string;
}

interface Service {
  idService: string;
  clientId: string;
  clientName: string;
  tipeLayanan: "Tenang" | "Rapi" | "Fokus" | "Jaga" | "Efisien";
  unitAktif: number;
  unitOnHold: number;
  assignAsistenId: string;
  tanggalMulai: string;
  sharing: { idUser: string; name: string }[];
}

interface ServiceHistoryItem {
  idService: string;
  clientName: string;
  tipeLayanan: string;
  unit: number;
  tanggal: string;
  status: "Aktif" | "Hold" | "Pending";
}

async function fetchClients(): Promise<Client[]> {
  return [
    { idUser: "C001", name: "Client A" },
    { idUser: "C002", name: "Client B" },
  ];
}

async function fetchActiveServices(): Promise<Service[]> {
  return [
    {
      idService: "S001",
      clientId: "C001",
      clientName: "Client A",
      tipeLayanan: "Tenang",
      unitAktif: 5,
      unitOnHold: 2,
      assignAsistenId: "U001",
      tanggalMulai: "2026-02-20",
      sharing: [{ idUser: "U002", name: "Asisten 2" }],
    },
  ];
}

async function fetchServiceHistory(): Promise<ServiceHistoryItem[]> {
  return [
    { idService: "S001", clientName: "Client A", tipeLayanan: "Tenang", unit: 5, tanggal: "2026-02-20", status: "Aktif" },
  ];
}

async function activateService(service: Service): Promise<boolean> {
  console.log("Activate Service:", service);
  return true;
}

// ─── Asistenmu mock data ──────────────────────────────────────────────────────

interface AsistenmuTask {
  id: string;
  clientName: string;
  partnerName?: string;
  partnerId?: string;
  serviceType: string;
  unitUsed?: number;
  deadline?: string;
  instruksi?: string;
  status: string;
}

interface AsistenmuTicket {
  id: string;
  notes: string;
  status: string;
}

interface AsistenmuHistoryItem {
  id: string;
  taskId: string;
  action: string;
  date: string;
}

// Mock client layanan terkait Asistenmu
interface AsistenmuClientLayanan {
  idLayanan: string;
  tipeLayanan: string;
  namaClient: string;
  statusLayanan: string;
  unitAktif: number;
  shareLayanan: string;
}

const mockAsistenmuClientLayanan: AsistenmuClientLayanan[] = [
  { idLayanan: "S001", tipeLayanan: "Tenang", namaClient: "PT Maju Jaya", statusLayanan: "Aktif", unitAktif: 5, shareLayanan: "Asisten 2" },
  { idLayanan: "S002", tipeLayanan: "Rapi", namaClient: "CV Berkah", statusLayanan: "Aktif", unitAktif: 3, shareLayanan: "-" },
  { idLayanan: "S003", tipeLayanan: "Fokus", namaClient: "Budi Santoso", statusLayanan: "Hold", unitAktif: 2, shareLayanan: "Asisten 3, Asisten 4" },
];

const mockAsistenmuTasks: AsistenmuTask[] = [
  { id: "AT001", clientName: "PT Maju Jaya", serviceType: "Tenang", status: "PermintaanBaru" },
  { id: "AT002", clientName: "CV Berkah", serviceType: "Rapi", status: "PermintaanBaru" },
  { id: "AT003", clientName: "PT Maju Jaya", partnerName: "Siti Rahayu", partnerId: "P002", serviceType: "Fokus", unitUsed: 3, deadline: "2026-03-01", instruksi: "Buat konten untuk media sosial", status: "QAAsistenmu" },
  { id: "AT004", clientName: "Budi Santoso", partnerName: "Ahmad Fauzi", partnerId: "P003", serviceType: "Tenang", unitUsed: 2, deadline: "2026-03-05", instruksi: "Bantu pengelolaan email", status: "RevisiClient" },
  { id: "AT005", clientName: "CV Berkah", partnerName: "Rudi Hermawan", partnerId: "P005", serviceType: "Jaga", unitUsed: 1, deadline: "2026-03-10", instruksi: "Monitor laporan harian", status: "DitolakPartner" },
  { id: "AT006", clientName: "PT Maju Jaya", partnerName: "Siti Rahayu", partnerId: "P002", serviceType: "Efisien", unitUsed: 4, deadline: "2026-03-08", instruksi: "Optimasi proses administrasi", status: "ReviewClient" },
  { id: "AT007", clientName: "Budi Santoso", partnerName: "Ahmad Fauzi", partnerId: "P003", serviceType: "Tenang", unitUsed: 5, deadline: "2026-02-28", instruksi: "Pengelolaan kalender", status: "Selesai" },
];

const mockAsistenmuTickets: AsistenmuTicket[] = [
  { id: "TK001", notes: "Client minta update status task AT003", status: "Masuk" },
  { id: "TK002", notes: "Partner tidak bisa akses file GDrive", status: "Proses" },
  { id: "TK003", notes: "Permintaan perpanjangan deadline", status: "Resolved" },
];

const mockAsistenmuHistory: AsistenmuHistoryItem[] = [
  { id: "AH001", taskId: "AT007", action: "Task diselesaikan", date: "2024-03-15" },
  { id: "AH002", taskId: "AT006", action: "Task dikirim ke Review Client", date: "2024-03-14" },
  { id: "AH003", taskId: "AT005", action: "Task ditolak Partner, menunggu delegasi ulang", date: "2024-03-13" },
];

// ─── Helper components ────────────────────────────────────────────────────────

function SectionCollapsible({
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
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm bg-slate-100 hover:bg-slate-200 rounded-lg mb-1"
        >
          <span>{title}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 mb-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Nonaktif: "bg-slate-100 text-slate-500",
    Suspended: "bg-red-100 text-red-700",
    Masuk: "bg-blue-100 text-blue-700",
    Proses: "bg-amber-100 text-amber-700",
    Selesai: "bg-emerald-100 text-emerald-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
    Hold: "bg-orange-100 text-orange-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    open: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        map[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Ticket Action Modal (shared) ─────────────────────────────────────────────

interface TicketActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  mode: "progress" | "resolve";
  ticketId: string;
}

function TicketActionModal({ open, onClose, onConfirm, mode, ticketId }: TicketActionModalProps) {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (!notes.trim()) return;
    onConfirm(notes.trim());
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            {mode === "progress" ? "Progress Tiket" : "Resolve Tiket"}: {ticketId}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">
              Notes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder={mode === "progress" ? "Catatan progress tiket..." : "Catatan penyelesaian tiket..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Batal
          </Button>
          <Button
            size="sm"
            className={mode === "progress" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
            onClick={handleConfirm}
            disabled={!notes.trim()}
          >
            {mode === "progress" ? "Simpan Progress" : "Resolve Tiket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── AdminUser Dashboard ──────────────────────────────────────────────────────

function AdminUserDashboard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");

  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  const [pendingPartnerLevel, setPendingPartnerLevel] = useState<Record<string, string>>({});
  const [pendingVerifiedSkill, setPendingVerifiedSkill] = useState<Record<string, string>>({});
  const [approveErrors, setApproveErrors] = useState<Record<string, string>>({});

  // Ticket action modal state
  const [ticketModal, setTicketModal] = useState<{ open: boolean; mode: "progress" | "resolve"; ticketId: string }>({
    open: false,
    mode: "resolve",
    ticketId: "",
  });

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchTickets().then(setTickets);
    fetchHistory().then(setHistory);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.idUser.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.name.toLowerCase().includes(searchUser.toLowerCase())
  );
  const pendingUsers = filteredUsers.filter((u) => u.status === "Pending");
  const aktifUsers = filteredUsers.filter((u) => u.status === "Aktif");
  const suspendedUsers = filteredUsers.filter((u) => u.status === "Suspended");

  const totalUser = users.length;
  const totalPending = users.filter((u) => u.status === "Pending").length;
  const totalClient = users.filter((u) => u.role === "Client" && u.status === "Aktif").length;
  const totalInternal = users.filter((u) => u.role === "Internal" && u.status === "Aktif").length;
  const totalPartner = users.filter((u) => u.role === "Partner" && u.status === "Aktif").length;
  const totalSuspended = users.filter((u) => u.status === "Suspended").length;

  const approveUser = (u: UserItem) => {
    if (u.role === "Internal") {
      const role = pendingRoles[u.idUser] || "";
      if (!role) {
        setApproveErrors((prev) => ({ ...prev, [u.idUser]: "Pilih role terlebih dahulu." }));
        return;
      }
    }
    if (u.role === "Partner") {
      const level = pendingPartnerLevel[u.idUser] || "";
      const skill = pendingVerifiedSkill[u.idUser] || "";
      if (!level || !skill) {
        setApproveErrors((prev) => ({
          ...prev,
          [u.idUser]: "Level Partner dan Verified Skill wajib diisi.",
        }));
        return;
      }
    }

    setApproveErrors((prev) => {
      const next = { ...prev };
      delete next[u.idUser];
      return next;
    });

    setUsers((prev) =>
      prev.map((item) => {
        if (item.idUser !== u.idUser) return item;
        const updated: UserItem = { ...item, status: "Aktif" as const };
        if (u.role === "Internal") updated.assignedRole = pendingRoles[u.idUser];
        if (u.role === "Partner") {
          updated.levelPartner = pendingPartnerLevel[u.idUser];
          updated.verifiedSkill = (pendingVerifiedSkill[u.idUser] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return updated;
      })
    );

    setPendingRoles((prev) => { const n = { ...prev }; delete n[u.idUser]; return n; });
    setPendingPartnerLevel((prev) => { const n = { ...prev }; delete n[u.idUser]; return n; });
    setPendingVerifiedSkill((prev) => { const n = { ...prev }; delete n[u.idUser]; return n; });
  };

  const rejectUser = (idUser: string) => {
    setUsers((prev) => prev.filter((u) => u.idUser !== idUser));
    setApproveErrors((prev) => { const n = { ...prev }; delete n[idUser]; return n; });
    setPendingRoles((prev) => { const n = { ...prev }; delete n[idUser]; return n; });
    setPendingPartnerLevel((prev) => { const n = { ...prev }; delete n[idUser]; return n; });
    setPendingVerifiedSkill((prev) => { const n = { ...prev }; delete n[idUser]; return n; });
  };

  const suspendUser = (idUser: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.idUser === idUser ? { ...u, status: "Suspended" as const } : u))
    );
  };

  const reactivateUser = (idUser: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.idUser === idUser ? { ...u, status: "Aktif" as const } : u))
    );
  };

  const handleTicketAction = (notes: string) => {
    const { mode, ticketId } = ticketModal;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: mode === "progress" ? "Proses" : "Selesai" }
          : t
      )
    );
    setTicketModal({ open: false, mode: "resolve", ticketId: "" });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Total User</p>
            <p className="text-2xl font-bold text-slate-800">{totalUser}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 shadow-sm bg-amber-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-amber-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{totalPending}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 shadow-sm bg-blue-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-blue-600 mb-1">Client</p>
            <p className="text-2xl font-bold text-blue-700">{totalClient}</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 shadow-sm bg-teal-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-teal-600 mb-1">Internal</p>
            <p className="text-2xl font-bold text-teal-700">{totalInternal}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 shadow-sm bg-purple-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-purple-600 mb-1">Partner</p>
            <p className="text-2xl font-bold text-purple-700">{totalPartner}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 shadow-sm bg-red-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-red-600 mb-1">Suspended</p>
            <p className="text-2xl font-bold text-red-700">{totalSuspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Cari user berdasarkan ID atau nama..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pending Users */}
      <SectionCollapsible title={`Pending Users (${pendingUsers.length})`} defaultOpen>
        {pendingUsers.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Tidak ada user pending.</p>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((u) => (
              <Card key={u.idUser} className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <Badge variant="outline" className="text-xs">{u.role}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">ID: {u.idUser}</p>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-xs">Principal: {u.principalId}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {u.role === "Internal" && (
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-600">Assign Role</Label>
                          <Select
                            value={pendingRoles[u.idUser] || ""}
                            onValueChange={(val) =>
                              setPendingRoles((prev) => ({ ...prev, [u.idUser]: val }))
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Pilih role..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AdminUser">AdminUser</SelectItem>
                              <SelectItem value="AdminFinance">AdminFinance</SelectItem>
                              <SelectItem value="Asistenmu">Asistenmu</SelectItem>
                              <SelectItem value="Concierge">Concierge</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {u.role === "Partner" && (
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Level Partner</Label>
                            <Select
                              value={pendingPartnerLevel[u.idUser] || ""}
                              onValueChange={(val) =>
                                setPendingPartnerLevel((prev) => ({ ...prev, [u.idUser]: val }))
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Pilih level..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Verified Skill</Label>
                            <Input
                              className="h-8 text-xs"
                              placeholder="e.g. Design, SEO"
                              value={pendingVerifiedSkill[u.idUser] || ""}
                              onChange={(e) =>
                                setPendingVerifiedSkill((prev) => ({
                                  ...prev,
                                  [u.idUser]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      )}
                      {approveErrors[u.idUser] && (
                        <p className="text-xs text-red-600">{approveErrors[u.idUser]}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => approveUser(u)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 h-8 text-xs"
                          onClick={() => rejectUser(u.idUser)}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Active Users */}
      <SectionCollapsible title={`User Aktif (${aktifUsers.length})`}>
        {aktifUsers.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Tidak ada user aktif.</p>
        ) : (
          <div className="space-y-2">
            {aktifUsers.map((u) => (
              <Card key={u.idUser} className="border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{u.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">{u.idUser}</span>
                          <Badge variant="outline" className="text-xs py-0">{u.role}</Badge>
                          {u.assignedRole && (
                            <Badge className="text-xs py-0 bg-teal-100 text-teal-700 border-teal-200">{u.assignedRole}</Badge>
                          )}
                          {u.levelPartner && (
                            <Badge className="text-xs py-0 bg-purple-100 text-purple-700 border-purple-200">{u.levelPartner}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={u.status} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => suspendUser(u.idUser)}
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Suspended Users */}
      <SectionCollapsible title={`User Suspended (${suspendedUsers.length})`}>
        {suspendedUsers.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Tidak ada user suspended.</p>
        ) : (
          <div className="space-y-2">
            {suspendedUsers.map((u) => (
              <Card key={u.idUser} className="border-red-200 bg-red-50/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{u.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{u.idUser}</span>
                        <Badge variant="outline" className="text-xs py-0">{u.role}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={u.status} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => reactivateUser(u.idUser)}
                      >
                        Reaktivasi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Tickets */}
      <SectionCollapsible title={`Tiket (${tickets.length})`}>
        {tickets.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Tidak ada tiket.</p>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <Card key={t.id} className="border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-sm text-slate-800">{t.id}</span>
                        <span className="text-xs text-slate-500">— User: {t.userId}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{t.notes}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={t.status} />
                      {t.status !== "Selesai" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-amber-500 hover:bg-amber-600"
                            onClick={() => setTicketModal({ open: true, mode: "progress", ticketId: t.id })}
                          >
                            Progress
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setTicketModal({ open: true, mode: "resolve", ticketId: t.id })}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* History */}
      <SectionCollapsible title="History">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Belum ada history.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{h.action}</p>
                  <p className="text-xs text-slate-500">User: {h.userId}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{h.tanggal}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Ticket Action Modal */}
      <TicketActionModal
        open={ticketModal.open}
        onClose={() => setTicketModal({ open: false, mode: "resolve", ticketId: "" })}
        onConfirm={handleTicketAction}
        mode={ticketModal.mode}
        ticketId={ticketModal.ticketId}
      />
    </div>
  );
}

// ─── AdminFinance Dashboard ───────────────────────────────────────────────────

function AdminFinanceDashboard() {
  const [withdrawRequests, setWithdrawRequests] = useState(mockWithdrawRequests);
  const [perubahanData, setPerubahanData] = useState(mockPerubahanData);
  const [financeTickets, setFinanceTickets] = useState(mockFinanceTickets);

  // Aktivasi Layanan state
  const [clients, setClients] = useState<Client[]>([]);
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);

  // Autocomplete state for client search
  const [clientSearch, setClientSearch] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState<ClientExtended[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientExtended | null>(null);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const [activationForm, setActivationForm] = useState({
    tipeLayanan: "" as Service["tipeLayanan"] | "",
    unitAktif: "",
    assignAsistenId: "",
    tanggalMulai: "",
  });
  const [activating, setActivating] = useState(false);

  // Ticket action modal state
  const [ticketModal, setTicketModal] = useState<{ open: boolean; mode: "progress" | "resolve"; ticketId: string }>({
    open: false,
    mode: "resolve",
    ticketId: "",
  });

  useEffect(() => {
    fetchClients().then(setClients);
    fetchActiveServices().then(setActiveServices);
    fetchServiceHistory().then(setServiceHistory);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    setSelectedClient(null);
    if (value.trim().length > 0) {
      const q = value.toLowerCase();
      const filtered = mockClientsExtended.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.idUser.toLowerCase().includes(q) ||
          c.principalId.toLowerCase().includes(q)
      );
      setClientSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setClientSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectClient = (client: ClientExtended) => {
    setSelectedClient(client);
    setClientSearch(client.name);
    setShowSuggestions(false);
  };

  const handleActivate = async () => {
    if (!selectedClient || !activationForm.tipeLayanan || !activationForm.unitAktif) return;
    setActivating(true);
    const newService: Service = {
      idService: `S${Date.now()}`,
      clientId: selectedClient.idUser,
      clientName: selectedClient.name,
      tipeLayanan: activationForm.tipeLayanan as Service["tipeLayanan"],
      unitAktif: parseInt(activationForm.unitAktif),
      unitOnHold: 0,
      assignAsistenId: activationForm.assignAsistenId,
      tanggalMulai: activationForm.tanggalMulai,
      sharing: [],
    };
    await activateService(newService);
    setActiveServices((prev) => [...prev, newService]);
    setActivationForm({ tipeLayanan: "", unitAktif: "", assignAsistenId: "", tanggalMulai: "" });
    setSelectedClient(null);
    setClientSearch("");
    setActivating(false);
  };

  const approveWithdraw = (id: string) => {
    setWithdrawRequests((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "Approved" } : w))
    );
  };

  const rejectWithdraw = (id: string) => {
    setWithdrawRequests((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "Rejected" } : w))
    );
  };

  const approvePerubahan = (id: string) => {
    setPerubahanData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  };

  const rejectPerubahan = (id: string) => {
    setPerubahanData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
  };

  const handleTicketAction = (notes: string) => {
    const { mode, ticketId } = ticketModal;
    setFinanceTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: mode === "progress" ? "Proses" : "Selesai" }
          : t
      )
    );
    setTicketModal({ open: false, mode: "resolve", ticketId: "" });
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <SectionCollapsible title="Summary Keuangan" defaultOpen>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <p className="text-xs text-slate-500">GMV Total</p>
              </div>
              <p className="text-lg font-bold text-slate-800">{mockFinanceSummary.gmvTotal}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <p className="text-xs text-slate-500">Margin</p>
              </div>
              <p className="text-lg font-bold text-emerald-700">{mockFinanceSummary.margin}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-slate-500">Layanan Aktif</p>
              </div>
              <p className="text-lg font-bold text-blue-700">{mockFinanceSummary.layananAktif}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-sm bg-amber-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-amber-600">Pending Withdraw</p>
              </div>
              <p className="text-lg font-bold text-amber-700">{mockFinanceSummary.pendingWithdraw}</p>
            </CardContent>
          </Card>
        </div>

        {/* GMV per Tipe Layanan */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">GMV per Tipe Layanan:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Tenang", value: mockFinanceSummary.gmvTenang, color: "border-teal-200 bg-teal-50", textColor: "text-teal-700" },
              { label: "Rapi", value: mockFinanceSummary.gmvRapi, color: "border-blue-200 bg-blue-50", textColor: "text-blue-700" },
              { label: "Fokus", value: mockFinanceSummary.gmvFokus, color: "border-purple-200 bg-purple-50", textColor: "text-purple-700" },
              { label: "Jaga", value: mockFinanceSummary.gmvJaga, color: "border-orange-200 bg-orange-50", textColor: "text-orange-700" },
              { label: "Efisien", value: mockFinanceSummary.gmvEfisien, color: "border-emerald-200 bg-emerald-50", textColor: "text-emerald-700" },
            ].map((item) => (
              <Card key={item.label} className={`shadow-sm ${item.color}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Layers className="h-3 w-3 text-slate-500" />
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                  <p className={`text-sm font-semibold ${item.textColor}`}>{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionCollapsible>

      {/* Aktivasi Layanan */}
      <SectionCollapsible title="Aktivasi Layanan">
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Client Autocomplete */}
              <div className="space-y-1">
                <Label className="text-xs">Client</Label>
                <div className="relative" ref={clientSearchRef}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    className="h-9 text-sm pl-8"
                    placeholder="Cari nama, ID, atau principal..."
                    value={clientSearch}
                    onChange={(e) => handleClientSearchChange(e.target.value)}
                    onFocus={() => {
                      if (clientSuggestions.length > 0) setShowSuggestions(true);
                    }}
                  />
                  {showSuggestions && clientSuggestions.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {clientSuggestions.map((c) => (
                        <button
                          key={c.idUser}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                          onClick={() => handleSelectClient(c)}
                        >
                          <p className="text-sm font-medium text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.idUser} · <span className="font-mono">{c.principalId}</span></p>
                        </button>
                      ))}
                    </div>
                  )}
                  {showSuggestions && clientSuggestions.length === 0 && clientSearch.trim().length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                      <p className="text-sm text-slate-400 px-3 py-2">Tidak ada client ditemukan.</p>
                    </div>
                  )}
                </div>
                {selectedClient && (
                  <p className="text-xs text-emerald-600 mt-1">✓ Dipilih: {selectedClient.name} ({selectedClient.idUser})</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tipe Layanan</Label>
                <Select
                  value={activationForm.tipeLayanan}
                  onValueChange={(val) => setActivationForm((prev) => ({ ...prev, tipeLayanan: val as Service["tipeLayanan"] }))}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Pilih tipe..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["Tenang", "Rapi", "Fokus", "Jaga", "Efisien"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit Aktif</Label>
                <Input
                  type="number"
                  className="h-9 text-sm"
                  placeholder="Jumlah unit..."
                  value={activationForm.unitAktif}
                  onChange={(e) => setActivationForm((prev) => ({ ...prev, unitAktif: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Assign Asisten ID</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="ID Asisten..."
                  value={activationForm.assignAsistenId}
                  onChange={(e) => setActivationForm((prev) => ({ ...prev, assignAsistenId: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tanggal Mulai</Label>
                <Input
                  type="date"
                  className="h-9 text-sm"
                  value={activationForm.tanggalMulai}
                  onChange={(e) => setActivationForm((prev) => ({ ...prev, tanggalMulai: e.target.value }))}
                />
              </div>
            </div>
            <Button
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700"
              onClick={handleActivate}
              disabled={activating || !selectedClient || !activationForm.tipeLayanan || !activationForm.unitAktif}
            >
              {activating ? "Mengaktifkan..." : "Aktifkan Layanan"}
            </Button>
          </CardContent>
        </Card>

        {activeServices.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-slate-600 px-1">Layanan Aktif:</p>
            {activeServices.map((s) => (
              <Card key={s.idService} className="border-teal-200 bg-teal-50/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{s.clientName} — {s.tipeLayanan}</p>
                      <p className="text-xs text-slate-500">ID: {s.idService} | Unit: {s.unitAktif} | Mulai: {s.tanggalMulai}</p>
                    </div>
                    <StatusBadge status="Aktif" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Withdraw Requests */}
      <SectionCollapsible title={`Permintaan Withdraw (${withdrawRequests.filter(w => w.status === "Pending").length} pending)`}>
        <div className="space-y-2">
          {withdrawRequests.map((w) => (
            <Card key={w.id} className="border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-slate-800">{w.partner}</p>
                    <p className="text-sm font-semibold text-teal-700">{w.amount}</p>
                    <p className="text-xs text-slate-500">{w.bank} · {w.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={w.status} />
                    {w.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => approveWithdraw(w.id)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => rejectWithdraw(w.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCollapsible>

      {/* Perubahan Data Financial */}
      <SectionCollapsible title={`Perubahan Data Financial (${perubahanData.filter(p => p.status === "Pending").length} pending)`}>
        <div className="space-y-2">
          {perubahanData.map((p) => (
            <Card key={p.id} className="border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-slate-800">{p.partner}</p>
                    <p className="text-xs text-slate-500">Field: {p.field}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">{p.lama}</span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">{p.baru}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{p.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={p.status} />
                    {p.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => approvePerubahan(p.id)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => rejectPerubahan(p.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCollapsible>

      {/* Finance Tickets */}
      <SectionCollapsible title={`Tiket Finance (${financeTickets.length})`}>
        <div className="space-y-2">
          {financeTickets.map((t) => (
            <Card key={t.id} className="border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800">{t.subject}</p>
                    <p className="text-xs text-slate-500">{t.user} · {t.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={t.status} />
                    {t.status !== "Selesai" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-amber-500 hover:bg-amber-600"
                          onClick={() => setTicketModal({ open: true, mode: "progress", ticketId: t.id })}
                        >
                          Progress
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => setTicketModal({ open: true, mode: "resolve", ticketId: t.id })}
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCollapsible>

      {/* Service History */}
      <SectionCollapsible title="History Layanan">
        {serviceHistory.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Belum ada history layanan.</p>
        ) : (
          <div className="space-y-2">
            {serviceHistory.map((h) => (
              <div key={h.idService} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{h.clientName} — {h.tipeLayanan}</p>
                  <p className="text-xs text-slate-500">Unit: {h.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={h.status} />
                  <span className="text-xs text-slate-400">{h.tanggal}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Ticket Action Modal */}
      <TicketActionModal
        open={ticketModal.open}
        onClose={() => setTicketModal({ open: false, mode: "resolve", ticketId: "" })}
        onConfirm={handleTicketAction}
        mode={ticketModal.mode}
        ticketId={ticketModal.ticketId}
      />
    </div>
  );
}

// ─── Asistenmu Dashboard ──────────────────────────────────────────────────────

function AsistenmuDashboard() {
  const [tasks, setTasks] = useState<AsistenmuTask[]>(mockAsistenmuTasks);
  const [tickets, setTickets] = useState<AsistenmuTicket[]>(mockAsistenmuTickets);
  const [history] = useState<AsistenmuHistoryItem[]>(mockAsistenmuHistory);

  // Ticket action modal state
  const [ticketModal, setTicketModal] = useState<{ open: boolean; mode: "progress" | "resolve"; ticketId: string }>({
    open: false,
    mode: "resolve",
    ticketId: "",
  });

  // Delegation modal state — for "Delegasikan Ulang" (only partner field is editable)
  const [delegasiModal, setDelegasiModal] = useState<{
    open: boolean;
    taskId: string;
    task: AsistenmuTask | null;
  }>({ open: false, taskId: "", task: null });
  const [newPartnerId, setNewPartnerId] = useState("");
  const [newPartnerName, setNewPartnerName] = useState("");

  // Per-section filter state
  const [filterPermintaan, setFilterPermintaan] = useState("");
  const [filterQA, setFilterQA] = useState("");
  const [filterRevisi, setFilterRevisi] = useState("");
  const [filterDitolak, setFilterDitolak] = useState("");
  const [filterReview, setFilterReview] = useState("");
  const [filterSelesai, setFilterSelesai] = useState("");

  const filterTasks = (statusList: string[], query: string) =>
    tasks.filter(
      (t) =>
        statusList.includes(t.status) &&
        (query === "" ||
          t.id.toLowerCase().includes(query.toLowerCase()) ||
          t.clientName.toLowerCase().includes(query.toLowerCase()) ||
          (t.partnerName || "").toLowerCase().includes(query.toLowerCase()))
    );

  const permintaanBaru = filterTasks(["PermintaanBaru"], filterPermintaan);
  const qaAsistenmu = filterTasks(["QAAsistenmu"], filterQA);
  const revisiClient = filterTasks(["RevisiClient"], filterRevisi);
  const ditolakPartner = filterTasks(["DitolakPartner"], filterDitolak);
  const reviewClient = filterTasks(["ReviewClient"], filterReview);
  const selesai = filterTasks(["Selesai"], filterSelesai);

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleTicketAction = (notes: string) => {
    const { mode, ticketId } = ticketModal;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: mode === "progress" ? "Proses" : "Resolved" }
          : t
      )
    );
    setTicketModal({ open: false, mode: "resolve", ticketId: "" });
  };

  const openDelegasiUlang = (task: AsistenmuTask) => {
    setDelegasiModal({ open: true, taskId: task.id, task });
    setNewPartnerId(task.partnerId || "");
    setNewPartnerName(task.partnerName || "");
  };

  const handleDelegasiUlang = () => {
    if (!newPartnerName.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === delegasiModal.taskId
          ? { ...t, partnerId: newPartnerId, partnerName: newPartnerName, status: "QAAsistenmu" }
          : t
      )
    );
    setDelegasiModal({ open: false, taskId: "", task: null });
    setNewPartnerId("");
    setNewPartnerName("");
  };

  // Original delegation modal state (for new tasks)
  const [newDelegasiModal, setNewDelegasiModal] = useState<{ open: boolean; taskId: string }>({ open: false, taskId: "" });
  const [delegasiForm, setDelegasiForm] = useState({
    partnerId: "",
    partnerName: "",
    deadline: "",
    instruksi: "",
    unitEstimasi: "",
  });

  const handleDelegasi = () => {
    updateTaskStatus(newDelegasiModal.taskId, "QAAsistenmu");
    setNewDelegasiModal({ open: false, taskId: "" });
    setDelegasiForm({ partnerId: "", partnerName: "", deadline: "", instruksi: "", unitEstimasi: "" });
  };

  const TaskCard = ({ task, actions }: { task: AsistenmuTask; actions: React.ReactNode }) => (
    <Card className="border-slate-200">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{task.id}</span>
              <StatusBadge status={task.status} />
            </div>
            <p className="font-medium text-sm text-slate-800 mt-1">{task.clientName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">Layanan: {task.serviceType}</span>
              {task.partnerName && <span className="text-xs text-slate-500">· Partner: {task.partnerName}</span>}
              {task.unitUsed !== undefined && <span className="text-xs text-slate-500">· Unit: {task.unitUsed}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0">{actions}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "Permintaan Baru", count: tasks.filter(t => t.status === "PermintaanBaru").length, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
          { label: "QA Asistenmu", count: tasks.filter(t => t.status === "QAAsistenmu").length, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "Revisi Client", count: tasks.filter(t => t.status === "RevisiClient").length, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
          { label: "Ditolak Partner", count: tasks.filter(t => t.status === "DitolakPartner").length, color: "text-red-700", bg: "bg-red-50 border-red-200" },
          { label: "Review Client", count: tasks.filter(t => t.status === "ReviewClient").length, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
          { label: "Selesai", count: tasks.filter(t => t.status === "Selesai").length, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
        ].map((s) => (
          <Card key={s.label} className={`shadow-sm ${s.bg}`}>
            <CardContent className="p-3 text-center">
              <p className={`text-xs mb-1 ${s.color}`}>{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Terkait */}
      <SectionCollapsible title="Client Terkait" defaultOpen>
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-600 py-2">ID Layanan</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 py-2">Tipe Layanan</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 py-2">Nama Client</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 py-2">Status Layanan</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 py-2">Unit Aktif</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 py-2">Share Layanan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAsistenmuClientLayanan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-400 py-4">
                    Tidak ada data client terkait.
                  </TableCell>
                </TableRow>
              ) : (
                mockAsistenmuClientLayanan.map((c) => (
                  <TableRow key={c.idLayanan} className="hover:bg-slate-50">
                    <TableCell className="text-xs font-mono py-2">{c.idLayanan}</TableCell>
                    <TableCell className="text-xs py-2">{c.tipeLayanan}</TableCell>
                    <TableCell className="text-xs py-2">{c.namaClient}</TableCell>
                    <TableCell className="text-xs py-2">
                      <StatusBadge status={c.statusLayanan} />
                    </TableCell>
                    <TableCell className="text-xs py-2">{c.unitAktif}</TableCell>
                    <TableCell className="text-xs py-2">{c.shareLayanan}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCollapsible>

      {/* Task Management Section */}
      <SectionCollapsible title="Task Management" defaultOpen>
        <div className="space-y-4">
          {/* Permintaan Baru */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-blue-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">Permintaan Baru ({permintaanBaru.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterPermintaan}
              onChange={(e) => setFilterPermintaan(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {permintaanBaru.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Tidak ada permintaan baru.</p>
            ) : (
              <div className="space-y-2">
                {permintaanBaru.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actions={
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-teal-600 hover:bg-teal-700"
                        onClick={() => setNewDelegasiModal({ open: true, taskId: t.id })}
                      >
                        Delegasikan Task
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* QA Asistenmu */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-amber-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">QA Asistenmu ({qaAsistenmu.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterQA}
              onChange={(e) => setFilterQA(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {qaAsistenmu.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Tidak ada task dalam QA.</p>
            ) : (
              <div className="space-y-2">
                {qaAsistenmu.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actions={
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateTaskStatus(t.id, "ReviewClient")}
                      >
                        Kirim Review ke Client
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Revisi Client */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-orange-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">Revisi Client ({revisiClient.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterRevisi}
              onChange={(e) => setFilterRevisi(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {revisiClient.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Tidak ada task revisi.</p>
            ) : (
              <div className="space-y-2">
                {revisiClient.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actions={
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-orange-600 hover:bg-orange-700"
                        onClick={() => updateTaskStatus(t.id, "QAAsistenmu")}
                      >
                        Kirimkan Revisi ke Partner
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Ditolak Partner */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-red-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">Ditolak Partner ({ditolakPartner.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterDitolak}
              onChange={(e) => setFilterDitolak(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {ditolakPartner.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Tidak ada task ditolak.</p>
            ) : (
              <div className="space-y-2">
                {ditolakPartner.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actions={
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-red-600 hover:bg-red-700"
                        onClick={() => openDelegasiUlang(t)}
                      >
                        Delegasikan Ulang
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Review Client */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-purple-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">Review Client ({reviewClient.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterReview}
              onChange={(e) => setFilterReview(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {reviewClient.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Tidak ada task dalam review.</p>
            ) : (
              <div className="space-y-2">
                {reviewClient.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actions={
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateTaskStatus(t.id, "Selesai")}
                      >
                        Selesaikan Task
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selesai */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-4 bg-emerald-500 rounded" />
              <p className="text-xs font-semibold text-slate-700">Selesai ({selesai.length})</p>
            </div>
            <Input
              placeholder="Filter task..."
              value={filterSelesai}
              onChange={(e) => setFilterSelesai(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            {selesai.length === 0 ? (
              <p className="text-sm text-slate-500 px-2">Belum ada task selesai.</p>
            ) : (
              <div className="space-y-2">
                {selesai.map((t) => (
                  <TaskCard key={t.id} task={t} actions={null} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionCollapsible>

      {/* Tiket */}
      <SectionCollapsible title={`Tiket (${tickets.length})`}>
        {tickets.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Tidak ada tiket.</p>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <Card key={t.id} className="border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs text-slate-500">{t.id}</span>
                      <p className="text-sm text-slate-700 mt-1">{t.notes}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={t.status} />
                      {t.status !== "Resolved" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-amber-500 hover:bg-amber-600"
                            onClick={() => setTicketModal({ open: true, mode: "progress", ticketId: t.id })}
                          >
                            Progress
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setTicketModal({ open: true, mode: "resolve", ticketId: t.id })}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* History */}
      <SectionCollapsible title="History">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">Belum ada history.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{h.action}</p>
                  <p className="text-xs text-slate-500">Task: {h.taskId}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{h.date}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCollapsible>

      {/* Ticket Action Modal */}
      <TicketActionModal
        open={ticketModal.open}
        onClose={() => setTicketModal({ open: false, mode: "resolve", ticketId: "" })}
        onConfirm={handleTicketAction}
        mode={ticketModal.mode}
        ticketId={ticketModal.ticketId}
      />

      {/* Delegasikan Ulang Modal (Ditolak Partner) — only partner field editable */}
      <Dialog
        open={delegasiModal.open}
        onOpenChange={(v) => {
          if (!v) {
            setDelegasiModal({ open: false, taskId: "", task: null });
            setNewPartnerId("");
            setNewPartnerName("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delegasikan Ulang: {delegasiModal.taskId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Partner ID <span className="text-red-500">*</span></Label>
              <Input
                className="h-9 text-sm"
                placeholder="ID Partner baru..."
                value={newPartnerId}
                onChange={(e) => setNewPartnerId(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Nama Partner <span className="text-red-500">*</span></Label>
              <Input
                className="h-9 text-sm"
                placeholder="Nama Partner baru..."
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Deadline (read-only)</Label>
              <Input
                className="h-9 text-sm bg-slate-50"
                value={delegasiModal.task?.deadline || "-"}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Instruksi (read-only)</Label>
              <Input
                className="h-9 text-sm bg-slate-50"
                value={delegasiModal.task?.instruksi || "-"}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Unit Estimasi (read-only)</Label>
              <Input
                className="h-9 text-sm bg-slate-50"
                value={delegasiModal.task?.unitUsed !== undefined ? String(delegasiModal.task.unitUsed) : "-"}
                readOnly
                disabled
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDelegasiModal({ open: false, taskId: "", task: null });
                setNewPartnerId("");
                setNewPartnerName("");
              }}
            >
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleDelegasiUlang}
              disabled={!newPartnerName.trim()}
            >
              Delegasikan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Delegation Modal (Permintaan Baru) */}
      {newDelegasiModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base">Delegasikan Task: {newDelegasiModal.taskId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Partner ID</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="ID Partner..."
                  value={delegasiForm.partnerId}
                  onChange={(e) => setDelegasiForm((prev) => ({ ...prev, partnerId: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nama Partner</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="Nama Partner..."
                  value={delegasiForm.partnerName}
                  onChange={(e) => setDelegasiForm((prev) => ({ ...prev, partnerName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Deadline</Label>
                <Input
                  type="date"
                  className="h-9 text-sm"
                  value={delegasiForm.deadline}
                  onChange={(e) => setDelegasiForm((prev) => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Instruksi</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="Instruksi untuk partner..."
                  value={delegasiForm.instruksi}
                  onChange={(e) => setDelegasiForm((prev) => ({ ...prev, instruksi: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit Estimasi</Label>
                <Input
                  type="number"
                  className="h-9 text-sm"
                  placeholder="Estimasi unit..."
                  value={delegasiForm.unitEstimasi}
                  onChange={(e) => setDelegasiForm((prev) => ({ ...prev, unitEstimasi: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleDelegasi}>
                  Delegasikan
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setNewDelegasiModal({ open: false, taskId: "" })}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Concierge Dashboard ──────────────────────────────────────────────────────

interface ConciergeTask {
  id: string;
  clientName: string;
  partnerName?: string;
  serviceType: string;
  status: string;
}

interface ConciergeUser {
  id: string;
  name: string;
  role: string;
}

interface ConciergeService {
  id: string;
  clientName: string;
  serviceType: string;
  status: string;
}

interface ConciergeTicket {
  id: string;
  subject: string;
  toRole: string;
  detail: string;
  status: string;
}

const mockConciergeTasks: ConciergeTask[] = [
  { id: "CT001", clientName: "PT Maju Jaya", serviceType: "Tenang", status: "Permintaan Baru" },
  { id: "CT002", clientName: "CV Berkah", serviceType: "Rapi", status: "QA" },
  { id: "CT003", clientName: "Budi Santoso", partnerName: "Siti Rahayu", serviceType: "Fokus", status: "Revisi" },
  { id: "CT004", clientName: "PT Maju Jaya", partnerName: "Ahmad Fauzi", serviceType: "Jaga", status: "Ditolak" },
  { id: "CT005", clientName: "CV Berkah", partnerName: "Rudi Hermawan", serviceType: "Efisien", status: "Review" },
  { id: "CT006", clientName: "Budi Santoso", partnerName: "Siti Rahayu", serviceType: "Tenang", status: "Selesai" },
  { id: "CT007", clientName: "PT Maju Jaya", serviceType: "Rapi", status: "Permintaan Baru" },
];

const mockConciergeUsers: ConciergeUser[] = [
  { id: "U001", name: "Budi Santoso", role: "Client" },
  { id: "U002", name: "Siti Rahayu", role: "Partner" },
  { id: "U003", name: "Ahmad Fauzi", role: "Client" },
  { id: "U004", name: "Dewi Lestari", role: "Internal" },
  { id: "U005", name: "Rudi Hermawan", role: "Partner" },
  { id: "U008", name: "Rina Kusuma", role: "Internal" },
  { id: "U009", name: "Fajar Nugroho", role: "Internal" },
];

const mockConciergeServices: ConciergeService[] = [
  { id: "S001", clientName: "Client A", serviceType: "Tenang", status: "Aktif" },
  { id: "S002", clientName: "Client B", serviceType: "Rapi", status: "Aktif" },
  { id: "S003", clientName: "PT Maju Jaya", serviceType: "Fokus", status: "Hold" },
  { id: "S004", clientName: "CV Berkah", serviceType: "Jaga", status: "Pending" },
  { id: "S005", clientName: "Budi Santoso", serviceType: "Efisien", status: "Aktif" },
];

const ITEMS_PER_PAGE = 3;

function ConciergeDashboard() {
  const [globalSearch, setGlobalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [ticketRole, setTicketRole] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDetail, setTicketDetail] = useState("");
  const [tickets, setTickets] = useState<ConciergeTicket[]>([]);

  const filteredTasks = mockConciergeTasks.filter((t) => {
    const matchSearch =
      globalSearch === "" ||
      t.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.clientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (t.partnerName || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.serviceType.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.status.toLowerCase().includes(globalSearch.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredUsers = mockConciergeUsers.filter(
    (u) =>
      globalSearch === "" ||
      u.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredServices = mockConciergeServices.filter(
    (s) =>
      globalSearch === "" ||
      s.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.clientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.serviceType.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.status.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const totalTaskPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const totalServicePages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));

  const safeTaskPage = Math.min(currentTaskPage, totalTaskPages);
  const safeUserPage = Math.min(currentUserPage, totalUserPages);
  const safeServicePage = Math.min(currentServicePage, totalServicePages);

  const paginatedTasks = filteredTasks.slice((safeTaskPage - 1) * ITEMS_PER_PAGE, safeTaskPage * ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((safeUserPage - 1) * ITEMS_PER_PAGE, safeUserPage * ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice((safeServicePage - 1) * ITEMS_PER_PAGE, safeServicePage * ITEMS_PER_PAGE);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketRole || !ticketSubject || !ticketDetail) return;
    const newTicket: ConciergeTicket = {
      id: `TKT${Date.now()}`,
      subject: ticketSubject,
      toRole: ticketRole,
      detail: ticketDetail,
      status: "open",
    };
    setTickets((prev) => [newTicket, ...prev]);
    setTicketRole("");
    setTicketSubject("");
    setTicketDetail("");
  };

  return (
    <div className="space-y-4">
      <SectionCollapsible title="Search Task / User / Layanan" defaultOpen>
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search Task / User / Layanan"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentTaskPage(1);
                setCurrentUserPage(1);
                setCurrentServicePage(1);
              }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentTaskPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-sm w-full sm:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Permintaan Baru", "QA", "Revisi", "Ditolak", "Review", "Selesai"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-1">
          <p className="text-xs font-semibold text-slate-600 mb-2">Task ({filteredTasks.length})</p>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Task ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Client</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Partner</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Layanan</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-slate-400 py-4">Tidak ada data task.</TableCell>
                  </TableRow>
                ) : (
                  paginatedTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs font-mono py-2">{task.id}</TableCell>
                      <TableCell className="text-xs py-2">{task.clientName}</TableCell>
                      <TableCell className="text-xs py-2">{task.partnerName || "-"}</TableCell>
                      <TableCell className="text-xs py-2">{task.serviceType}</TableCell>
                      <TableCell className="text-xs py-2"><StatusBadge status={task.status} /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentTaskPage((p) => Math.max(1, p - 1))} disabled={safeTaskPage === 1}>Prev</Button>
            <p className="text-xs text-slate-500">Page {safeTaskPage} / {totalTaskPages}</p>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentTaskPage((p) => Math.min(totalTaskPages, p + 1))} disabled={safeTaskPage === totalTaskPages}>Next</Button>
          </div>
        </div>

        <div className="mt-4 mb-1">
          <p className="text-xs font-semibold text-slate-600 mb-2">User ({filteredUsers.length})</p>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">User ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Name</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-slate-400 py-4">Tidak ada data user.</TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs font-mono py-2">{user.id}</TableCell>
                      <TableCell className="text-xs py-2">{user.name}</TableCell>
                      <TableCell className="text-xs py-2"><Badge variant="outline" className="text-xs py-0">{user.role}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentUserPage((p) => Math.max(1, p - 1))} disabled={safeUserPage === 1}>Prev</Button>
            <p className="text-xs text-slate-500">Page {safeUserPage} / {totalUserPages}</p>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentUserPage((p) => Math.min(totalUserPages, p + 1))} disabled={safeUserPage === totalUserPages}>Next</Button>
          </div>
        </div>

        <div className="mt-4 mb-1">
          <p className="text-xs font-semibold text-slate-600 mb-2">Layanan ({filteredServices.length})</p>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Layanan ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Client</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Tipe Layanan</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 py-2">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-slate-400 py-4">Tidak ada data layanan.</TableCell>
                  </TableRow>
                ) : (
                  paginatedServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs font-mono py-2">{service.id}</TableCell>
                      <TableCell className="text-xs py-2">{service.clientName}</TableCell>
                      <TableCell className="text-xs py-2">{service.serviceType}</TableCell>
                      <TableCell className="text-xs py-2"><StatusBadge status={service.status} /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentServicePage((p) => Math.max(1, p - 1))} disabled={safeServicePage === 1}>Prev</Button>
            <p className="text-xs text-slate-500">Page {safeServicePage} / {totalServicePages}</p>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCurrentServicePage((p) => Math.min(totalServicePages, p + 1))} disabled={safeServicePage === totalServicePages}>Next</Button>
          </div>
        </div>
      </SectionCollapsible>

      <SectionCollapsible title="Buat Tiket" defaultOpen>
        <form onSubmit={handleCreateTicket} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Kepada Role</Label>
            <Select value={ticketRole} onValueChange={setTicketRole} required>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Pilih role tujuan..." />
              </SelectTrigger>
              <SelectContent>
                {["AdminUser", "AdminFinance", "Asistenmu", "Partner"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Judul Tiket</Label>
            <Input
              placeholder="Masukkan judul tiket"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Detail Tiket</Label>
            <Textarea
              placeholder="Masukkan detail tiket"
              value={ticketDetail}
              onChange={(e) => setTicketDetail(e.target.value)}
              className="text-sm min-h-[80px]"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!ticketRole || !ticketSubject || !ticketDetail}
          >
            Kirim Tiket
          </Button>
        </form>

        {tickets.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600">Tiket Terbaru:</p>
            {tickets.map((t) => (
              <Card key={t.id} className="border-slate-200">
                <CardHeader className="pb-1 pt-3 px-4">
                  <CardTitle className="text-sm font-semibold text-slate-800">{t.subject}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 pt-0 space-y-1">
                  <p className="text-xs text-slate-500">Kepada: <span className="font-medium text-slate-700">{t.toRole}</span></p>
                  <p className="text-sm text-slate-600">{t.detail}</p>
                  <div className="pt-1">
                    <StatusBadge status={t.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCollapsible>
    </div>
  );
}

// ─── Superadmin Collapsible Wrapper ───────────────────────────────────────────

function SuperadminCollapsibleSection({
  title,
  accentColor,
  children,
}: {
  title: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm mb-1"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className={`h-4 w-1.5 rounded-full ${accentColor}`} />
            <span className="font-bold text-sm text-slate-800">{title}</span>
          </div>
          {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 mb-6 pl-2 border-l-2 border-slate-100">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Main InternalDashboard ───────────────────────────────────────────────────

type DashboardRole = "AdminUser" | "Asistenmu" | "AdminFinance" | "Superadmin" | "Concierge";

export default function InternalDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState<DashboardRole>("AdminUser");

  return (
    <DashboardShell
      header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Internal Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {role === "AdminUser" && "Manajemen User & Tiket"}
              {role === "Asistenmu" && "Manajemen Task & Delegasi"}
              {role === "AdminFinance" && "Manajemen Keuangan & Layanan"}
              {role === "Superadmin" && "Akses Penuh Semua Dashboard"}
              {role === "Concierge" && "Concierge Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-500 shrink-0">Role:</Label>
            <Select value={role} onValueChange={(val) => setRole(val as DashboardRole)}>
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AdminUser">AdminUser</SelectItem>
                <SelectItem value="Asistenmu">Asistenmu</SelectItem>
                <SelectItem value="AdminFinance">AdminFinance</SelectItem>
                <SelectItem value="Superadmin">Superadmin</SelectItem>
                <SelectItem value="Concierge">Concierge</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => navigate({ to: "/" })}
            >
              Keluar
            </Button>
          </div>
        </div>
      }
    >
      {role === "AdminUser" && (
        <section>
          <AdminUserDashboard />
        </section>
      )}
      {role === "Asistenmu" && (
        <section>
          <AsistenmuDashboard />
        </section>
      )}
      {role === "AdminFinance" && (
        <section>
          <AdminFinanceDashboard />
        </section>
      )}
      {role === "Concierge" && (
        <section>
          <ConciergeDashboard />
        </section>
      )}
      {role === "Superadmin" && (
        <div className="space-y-4">
          <SuperadminCollapsibleSection title="AdminUser Dashboard" accentColor="bg-blue-500">
            <AdminUserDashboard />
          </SuperadminCollapsibleSection>

          <SuperadminCollapsibleSection title="AdminFinance Dashboard" accentColor="bg-emerald-500">
            <AdminFinanceDashboard />
          </SuperadminCollapsibleSection>

          <SuperadminCollapsibleSection title="Asistenmu Dashboard" accentColor="bg-teal-500">
            <AsistenmuDashboard />
          </SuperadminCollapsibleSection>

          <SuperadminCollapsibleSection title="Concierge Dashboard" accentColor="bg-purple-500">
            <ConciergeDashboard />
          </SuperadminCollapsibleSection>
        </div>
      )}
    </DashboardShell>
  );
}
