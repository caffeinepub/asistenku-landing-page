import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Mail,
  Calendar,
  User,
  AlertCircle,
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
  gmvConcierge: "Rp 75.000.000",
  gmvVirtual: "Rp 50.500.000",
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

async function topupService(idService: string, tambahanUnit: number): Promise<boolean> {
  console.log("Top-up Service:", idService, tambahanUnit);
  return true;
}

// ─── Asistenmu mock data ──────────────────────────────────────────────────────

interface AsistenmuTask {
  id: string;
  clientName: string;
  partnerName?: string;
  serviceType: string;
  unitUsed?: number;
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

const mockAsistenmuTasks: AsistenmuTask[] = [
  { id: "AT001", clientName: "PT Maju Jaya", serviceType: "Tenang", status: "PermintaanBaru" },
  { id: "AT002", clientName: "CV Berkah", serviceType: "Rapi", status: "PermintaanBaru" },
  { id: "AT003", clientName: "PT Maju Jaya", partnerName: "Siti Rahayu", serviceType: "Fokus", unitUsed: 3, status: "QAAsistenmu" },
  { id: "AT004", clientName: "Budi Santoso", partnerName: "Ahmad Fauzi", serviceType: "Tenang", unitUsed: 2, status: "RevisiClient" },
  { id: "AT005", clientName: "CV Berkah", partnerName: "Rudi Hermawan", serviceType: "Jaga", unitUsed: 1, status: "DitolakPartner" },
  { id: "AT006", clientName: "PT Maju Jaya", partnerName: "Siti Rahayu", serviceType: "Efisien", unitUsed: 4, status: "ReviewClient" },
  { id: "AT007", clientName: "Budi Santoso", partnerName: "Ahmad Fauzi", serviceType: "Tenang", unitUsed: 5, status: "Selesai" },
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

// ─── AdminUser Dashboard ──────────────────────────────────────────────────────

function AdminUserDashboard() {
  // --- State ---
  const [users, setUsers] = useState<UserItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");

  // Per-user role selection for Internal pending users (keyed by idUser)
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  // Per-user partner level for Partner pending users (keyed by idUser)
  const [pendingPartnerLevel, setPendingPartnerLevel] = useState<Record<string, string>>({});
  // Per-user verified skill input for Partner pending users (keyed by idUser)
  const [pendingVerifiedSkill, setPendingVerifiedSkill] = useState<Record<string, string>>({});
  // Validation error messages per user
  const [approveErrors, setApproveErrors] = useState<Record<string, string>>({});

  // --- Load Data ---
  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchTickets().then(setTickets);
    fetchHistory().then(setHistory);
  }, []);

  // --- Filtered lists ---
  const filteredUsers = users.filter(
    (u) =>
      u.idUser.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.name.toLowerCase().includes(searchUser.toLowerCase())
  );
  const pendingUsers = filteredUsers.filter((u) => u.status === "Pending");
  const aktifUsers = filteredUsers.filter((u) => u.status === "Aktif");
  const suspendedUsers = filteredUsers.filter((u) => u.status === "Suspended");

  // --- Summary Counts ---
  const totalUser = users.length;
  const totalPending = users.filter((u) => u.status === "Pending").length;
  const totalClient = users.filter((u) => u.role === "Client" && u.status === "Aktif").length;
  const totalInternal = users.filter((u) => u.role === "Internal" && u.status === "Aktif").length;
  const totalPartner = users.filter((u) => u.role === "Partner" && u.status === "Aktif").length;
  const totalSuspended = users.filter((u) => u.status === "Suspended").length;

  // --- Action handlers ---
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
        if (u.role === "Internal") {
          updated.assignedRole = pendingRoles[u.idUser];
        }
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
          placeholder="Search user by ID / Name"
          className="pl-9"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>

      {/* Pending Users */}
      <SectionCollapsible title={`⏳ Pending Users (${pendingUsers.length})`} defaultOpen>
        {pendingUsers.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">No pending users</p>
        ) : (
          pendingUsers.map((u) => (
            <div
              key={u.idUser}
              className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                {/* User Info */}
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    ID: <span className="font-mono">{u.idUser}</span> | {u.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Role:{" "}
                    <span className="font-semibold text-slate-700">{u.role}</span>
                    {u.assignedRole && (
                      <span className="ml-1 text-teal-600">({u.assignedRole})</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">Principal: {u.principalId}</p>

                  {/* Internal: Role selector */}
                  {u.role === "Internal" && (
                    <div className="mt-2">
                      <Label className="text-xs text-slate-600 mb-1 block">Assign Role Internal</Label>
                      <Select
                        value={pendingRoles[u.idUser] || ""}
                        onValueChange={(val) =>
                          setPendingRoles((prev) => ({ ...prev, [u.idUser]: val }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs w-48">
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asistenmu">Asistenmu</SelectItem>
                          <SelectItem value="AdminFinance">AdminFinance</SelectItem>
                          <SelectItem value="Concierge">Concierge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Partner: Level dropdown + Verified Skill input */}
                  {u.role === "Partner" && (
                    <div className="space-y-2 mt-2">
                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">Level Partner</Label>
                        <Select
                          value={pendingPartnerLevel[u.idUser] || ""}
                          onValueChange={(val) =>
                            setPendingPartnerLevel((prev) => ({ ...prev, [u.idUser]: val }))
                          }
                        >
                          <SelectTrigger className="h-8 text-xs w-48">
                            <SelectValue placeholder="Pilih Level Partner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        placeholder="Verified Skill (pisahkan koma)"
                        value={pendingVerifiedSkill[u.idUser] || ""}
                        onChange={(e) =>
                          setPendingVerifiedSkill((prev) => ({
                            ...prev,
                            [u.idUser]: e.target.value,
                          }))
                        }
                        className="h-8 text-xs w-full max-w-xs"
                      />
                    </div>
                  )}

                  {/* Validation error */}
                  {approveErrors[u.idUser] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {approveErrors[u.idUser]}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:flex-col sm:items-end">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3"
                    onClick={() => approveUser(u)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs h-7 px-3"
                    onClick={() => rejectUser(u.idUser)}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </SectionCollapsible>

      {/* Active Users */}
      <SectionCollapsible title={`✅ Active Users (${aktifUsers.length})`}>
        {aktifUsers.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">No active users</p>
        ) : (
          aktifUsers.map((u) => (
            <div
              key={u.idUser}
              className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">
                    ID: <span className="font-mono">{u.idUser}</span> | {u.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Role: <span className="font-semibold text-slate-700">{u.role}</span>
                    {u.assignedRole && (
                      <span className="ml-1 text-teal-600">({u.assignedRole})</span>
                    )}
                    {u.levelPartner && (
                      <span className="ml-1 text-purple-600">Level: {u.levelPartner}</span>
                    )}
                  </p>
                  {u.verifiedSkill && u.verifiedSkill.length > 0 && (
                    <p className="text-xs text-slate-400">
                      Skills: {u.verifiedSkill.join(", ")}
                    </p>
                  )}
                  <StatusBadge status={u.status} />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => suspendUser(u.idUser)}
                >
                  Suspend
                </Button>
              </div>
            </div>
          ))
        )}
      </SectionCollapsible>

      {/* Suspended Users */}
      <SectionCollapsible title={`🚫 Suspended Users (${suspendedUsers.length})`}>
        {suspendedUsers.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">No suspended users</p>
        ) : (
          suspendedUsers.map((u) => (
            <div
              key={u.idUser}
              className="border border-red-100 p-3 rounded-lg mb-2 bg-red-50 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">
                    ID: <span className="font-mono">{u.idUser}</span> | {u.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Role: <span className="font-semibold text-slate-700">{u.role}</span>
                  </p>
                  <StatusBadge status={u.status} />
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3"
                  onClick={() => reactivateUser(u.idUser)}
                >
                  Reaktivasi
                </Button>
              </div>
            </div>
          ))
        )}
      </SectionCollapsible>

      {/* Tickets */}
      <SectionCollapsible title={`🎫 Tiket (${tickets.length})`}>
        {tickets.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">No tickets</p>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">ID: {t.id} | User: {t.userId}</p>
                  <p className="text-xs text-slate-500">{t.notes}</p>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            </div>
          ))
        )}
      </SectionCollapsible>

      {/* History */}
      <SectionCollapsible title={`📋 History (${history.length})`}>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">No history</p>
        ) : (
          history.map((h) => (
            <div key={h.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <p className="text-sm font-medium text-slate-800">{h.action}</p>
              <p className="text-xs text-slate-500">User: {h.userId} | {h.tanggal}</p>
            </div>
          ))
        )}
      </SectionCollapsible>
    </div>
  );
}

// ─── Asistenmu Dashboard ──────────────────────────────────────────────────────

function AsistenmuDashboard() {
  const [tasks, setTasks] = useState<AsistenmuTask[]>(mockAsistenmuTasks);
  const [tickets, setTickets] = useState<AsistenmuTicket[]>(mockAsistenmuTickets);
  const [history] = useState<AsistenmuHistoryItem[]>(mockAsistenmuHistory);

  const [searchTask, setSearchTask] = useState<Record<string, string>>({});
  const [searchTicket, setSearchTicket] = useState("");
  const [searchHistory, setSearchHistory] = useState("");

  const [selectedTask, setSelectedTask] = useState<AsistenmuTask | null>(null);

  // Delegation modal fields
  const [delegasiPartner, setDelegasiPartner] = useState("");
  const [delegasiJam, setDelegasiJam] = useState("");
  const [delegasiUnit, setDelegasiUnit] = useState("");
  const [delegasiGDriveInternal, setDelegasiGDriveInternal] = useState("");
  const [delegasiGDriveClient, setDelegasiGDriveClient] = useState("");

  const filterTask = (status: string) =>
    tasks.filter(
      (t) =>
        t.status === status &&
        (!searchTask[status] ||
          t.id.toLowerCase().includes(searchTask[status].toLowerCase()) ||
          t.clientName.toLowerCase().includes(searchTask[status].toLowerCase()))
    );

  const summaryCount = (status: string) => tasks.filter((t) => t.status === status).length;
  const totalClient = [...new Set(tasks.map((t) => t.clientName))].length;

  const openDelegasiModal = (task: AsistenmuTask) => {
    setSelectedTask(task);
    setDelegasiPartner("");
    setDelegasiJam("");
    setDelegasiUnit("");
    setDelegasiGDriveInternal("");
    setDelegasiGDriveClient("");
  };

  const closeDelegasiModal = () => setSelectedTask(null);

  const handleDelegasikan = () => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, partnerName: delegasiPartner, unitUsed: Number(delegasiUnit), status: "OnProgress" }
          : t
      )
    );
    closeDelegasiModal();
  };

  const handleKirimReviewKeClient = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "ReviewClient" } : t))
    );
  };

  const handleKirimRevisiKePartner = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "OnProgress" } : t))
    );
  };

  const handleSelesaikanTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Selesai" } : t))
    );
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "Resolved" } : t))
    );
  };

  const taskSections = [
    { title: "Permintaan Baru", status: "PermintaanBaru", type: "new" },
    { title: "Permintaan QA Asistenmu", status: "QAAsistenmu", type: "qa" },
    { title: "Permintaan Revisi Client", status: "RevisiClient", type: "revisi" },
    { title: "Task Ditolak Partner", status: "DitolakPartner", type: "reject" },
    { title: "Task Dalam Review Client", status: "ReviewClient", type: "review" },
    { title: "Task Selesai", status: "Selesai", type: "done" },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">List Client</p>
            <p className="text-2xl font-bold text-slate-800">{totalClient}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Task</p>
            <p className="text-2xl font-bold text-slate-800">{tasks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 shadow-sm bg-blue-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-blue-600 mb-1">Permintaan Baru</p>
            <p className="text-2xl font-bold text-blue-700">{summaryCount("PermintaanBaru")}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 shadow-sm bg-amber-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-amber-600 mb-1">Permintaan QA</p>
            <p className="text-2xl font-bold text-amber-700">{summaryCount("QAAsistenmu")}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 shadow-sm bg-orange-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-orange-600 mb-1">Revisi Client</p>
            <p className="text-2xl font-bold text-orange-700">{summaryCount("RevisiClient")}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 shadow-sm bg-red-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-red-600 mb-1">Ditolak Partner</p>
            <p className="text-2xl font-bold text-red-700">{summaryCount("DitolakPartner")}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 shadow-sm bg-purple-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-purple-600 mb-1">Review Client</p>
            <p className="text-2xl font-bold text-purple-700">{summaryCount("ReviewClient")}</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 shadow-sm bg-emerald-50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-emerald-600 mb-1">Selesai</p>
            <p className="text-2xl font-bold text-emerald-700">{summaryCount("Selesai")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Sections */}
      {taskSections.map((section) => {
        const list = filterTask(section.status);
        return (
          <SectionCollapsible
            key={section.status}
            title={`${section.title} (${list.length})`}
            defaultOpen={section.type === "new"}
          >
            <Input
              placeholder="Filter by ID / Client"
              value={searchTask[section.status] || ""}
              onChange={(e) =>
                setSearchTask((prev) => ({ ...prev, [section.status]: e.target.value }))
              }
              className="mb-3 text-sm"
            />

            {list.length === 0 ? (
              <p className="text-slate-500 text-sm py-2">Tidak ada task</p>
            ) : (
              list.map((task) => (
                <div
                  key={task.id}
                  className="border border-slate-200 p-3 rounded-lg mb-3 bg-white shadow-sm space-y-1"
                >
                  <p className="text-sm font-semibold text-slate-800">ID: {task.id}</p>
                  <p className="text-xs text-slate-600">Client: {task.clientName}</p>
                  <p className="text-xs text-slate-600">Partner: {task.partnerName || "-"}</p>
                  <p className="text-xs text-slate-600">Layanan: {task.serviceType}</p>
                  <p className="text-xs text-slate-600">Unit: {task.unitUsed ?? "-"}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {section.type === "new" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                        onClick={() => openDelegasiModal(task)}
                      >
                        Delegasikan Task
                      </Button>
                    )}

                    {section.type === "qa" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3"
                        onClick={() => handleKirimReviewKeClient(task.id)}
                      >
                        Kirim Review ke Client
                      </Button>
                    )}

                    {section.type === "revisi" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-7 px-3"
                          onClick={() => handleKirimRevisiKePartner(task.id)}
                        >
                          Kirimkan Revisi ke Partner
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-7 px-3"
                          onClick={() => handleSelesaikanTask(task.id)}
                        >
                          Selesaikan Task
                        </Button>
                      </>
                    )}

                    {section.type === "reject" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                        onClick={() => openDelegasiModal(task)}
                      >
                        Delegasikan Ulang
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </SectionCollapsible>
        );
      })}

      {/* Delegation Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl space-y-3 mx-4">
            <p className="font-bold text-lg text-slate-800">
              Delegasikan Task – {selectedTask.id}
            </p>
            <p className="text-xs text-slate-500">Client: {selectedTask.clientName} | Layanan: {selectedTask.serviceType}</p>

            <Input
              placeholder="Partner (id / principalId / nama / skill)"
              value={delegasiPartner}
              onChange={(e) => setDelegasiPartner(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Jam Efektif"
              type="number"
              value={delegasiJam}
              onChange={(e) => setDelegasiJam(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Unit Layanan Terpakai"
              type="number"
              value={delegasiUnit}
              onChange={(e) => setDelegasiUnit(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Link GDrive Internal"
              value={delegasiGDriveInternal}
              onChange={(e) => setDelegasiGDriveInternal(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Link GDrive Client"
              value={delegasiGDriveClient}
              onChange={(e) => setDelegasiGDriveClient(e.target.value)}
              className="text-sm"
            />

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={closeDelegasiModal}
                className="text-slate-600"
              >
                Batal
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleDelegasikan}
              >
                Delegasikan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tiket */}
      <SectionCollapsible title={`🎫 Tiket (${tickets.length})`}>
        <Input
          placeholder="Filter tiket"
          value={searchTicket}
          onChange={(e) => setSearchTicket(e.target.value)}
          className="mb-3 text-sm"
        />
        {tickets
          .filter(
            (t) =>
              !searchTicket ||
              t.id.toLowerCase().includes(searchTicket.toLowerCase()) ||
              t.notes.toLowerCase().includes(searchTicket.toLowerCase())
          )
          .map((t) => (
            <div key={t.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">ID: {t.id}</p>
                  <p className="text-xs text-slate-500">{t.notes}</p>
                  <StatusBadge status={t.status} />
                </div>
                {t.status !== "Resolved" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 ml-2"
                    onClick={() => handleResolveTicket(t.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
      </SectionCollapsible>

      {/* History */}
      <SectionCollapsible title={`📋 History (${history.length})`}>
        <Input
          placeholder="Filter history"
          value={searchHistory}
          onChange={(e) => setSearchHistory(e.target.value)}
          className="mb-3 text-sm"
        />
        {history
          .filter(
            (h) =>
              !searchHistory ||
              h.taskId.toLowerCase().includes(searchHistory.toLowerCase()) ||
              h.action.toLowerCase().includes(searchHistory.toLowerCase())
          )
          .map((h) => (
            <div key={h.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <p className="text-sm font-medium text-slate-800">Task: {h.taskId}</p>
              <p className="text-xs text-slate-500">Action: {h.action}</p>
              <p className="text-xs text-slate-400">Date: {h.date}</p>
            </div>
          ))}
      </SectionCollapsible>
    </div>
  );
}

// ─── AdminFinance Dashboard ───────────────────────────────────────────────────

function AdminFinanceDashboard() {
  const [withdrawRequests, setWithdrawRequests] = useState(mockWithdrawRequests);
  const [perubahanData, setPerubahanData] = useState(mockPerubahanData);
  const [financeTickets] = useState(mockFinanceTickets);

  // Aktivasi Layanan state
  const [clients, setClients] = useState<Client[]>([]);
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedTipe, setSelectedTipe] = useState<Service["tipeLayanan"] | "">("");
  const [unitInput, setUnitInput] = useState("");
  const [assignAsistenId, setAssignAsistenId] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [sharingInput, setSharingInput] = useState("");

  const [topupServiceId, setTopupServiceId] = useState("");
  const [topupUnit, setTopupUnit] = useState("");

  const [searchLayanan, setSearchLayanan] = useState<Record<string, string>>({});
  const [searchWithdraw, setSearchWithdraw] = useState("");
  const [searchPerubahan, setSearchPerubahan] = useState("");
  const [searchFinanceTicket, setSearchFinanceTicket] = useState("");

  useEffect(() => {
    fetchClients().then(setClients);
    fetchActiveServices().then(setActiveServices);
    fetchServiceHistory().then(setServiceHistory);
  }, []);

  const handleActivateService = async () => {
    if (!selectedClientId || !selectedTipe || !unitInput || !assignAsistenId || !tanggalMulai) return;
    const client = clients.find((c) => c.idUser === selectedClientId);
    if (!client) return;
    const sharingList = sharingInput
      ? sharingInput.split(",").map((s, i) => ({ idUser: `SH${i}`, name: s.trim() }))
      : [];
    const newService: Service = {
      idService: `S${Date.now()}`,
      clientId: selectedClientId,
      clientName: client.name,
      tipeLayanan: selectedTipe as Service["tipeLayanan"],
      unitAktif: Number(unitInput),
      unitOnHold: 0,
      assignAsistenId,
      tanggalMulai,
      sharing: sharingList,
    };
    const ok = await activateService(newService);
    if (ok) {
      setActiveServices((prev) => [...prev, newService]);
      setServiceHistory((prev) => [
        ...prev,
        {
          idService: newService.idService,
          clientName: client.name,
          tipeLayanan: selectedTipe,
          unit: Number(unitInput),
          tanggal: tanggalMulai,
          status: "Aktif",
        },
      ]);
      setSelectedClientId("");
      setSelectedTipe("");
      setUnitInput("");
      setAssignAsistenId("");
      setTanggalMulai("");
      setSharingInput("");
    }
  };

  const handleTopup = async () => {
    if (!topupServiceId || !topupUnit) return;
    const ok = await topupService(topupServiceId, Number(topupUnit));
    if (ok) {
      setActiveServices((prev) =>
        prev.map((s) =>
          s.idService === topupServiceId
            ? { ...s, unitAktif: s.unitAktif + Number(topupUnit) }
            : s
        )
      );
      setTopupServiceId("");
      setTopupUnit("");
    }
  };

  const handleWithdrawAction = (id: string, action: "Approved" | "Rejected") => {
    setWithdrawRequests((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: action } : w))
    );
  };

  const handlePerubahanAction = (id: string, action: "Approved" | "Rejected") => {
    setPerubahanData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
  };

  // Group active services by tipeLayanan
  const servicesByType = activeServices.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.tipeLayanan]) acc[s.tipeLayanan] = [];
    acc[s.tipeLayanan].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Summary */}
      <SectionCollapsible title="📊 Summary" defaultOpen>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">GMV Total</p>
              <p className="text-lg font-bold text-slate-800">{mockFinanceSummary.gmvTotal}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">GMV Concierge</p>
              <p className="text-lg font-bold text-slate-800">{mockFinanceSummary.gmvConcierge}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">GMV Virtual</p>
              <p className="text-lg font-bold text-slate-800">{mockFinanceSummary.gmvVirtual}</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 shadow-sm bg-emerald-50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-600 mb-1">Margin</p>
              <p className="text-lg font-bold text-emerald-700">{mockFinanceSummary.margin}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 shadow-sm bg-blue-50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-600 mb-1">Layanan Aktif</p>
              <p className="text-2xl font-bold text-blue-700">{mockFinanceSummary.layananAktif}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-sm bg-amber-50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-amber-600 mb-1">Pending Withdraw</p>
              <p className="text-2xl font-bold text-amber-700">{mockFinanceSummary.pendingWithdraw}</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 shadow-sm bg-orange-50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-orange-600 mb-1">Pending Perubahan</p>
              <p className="text-2xl font-bold text-orange-700">{mockFinanceSummary.pendingPerubahan}</p>
            </CardContent>
          </Card>
        </div>
      </SectionCollapsible>

      {/* Aktivasi Layanan */}
      <SectionCollapsible title="⚡ Aktivasi Layanan">
        <div className="space-y-3 p-1">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Client</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Pilih Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.idUser} value={c.idUser}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Tipe Layanan</Label>
            <Select value={selectedTipe} onValueChange={(v) => setSelectedTipe(v as Service["tipeLayanan"])}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                {["Tenang", "Rapi", "Fokus", "Jaga", "Efisien"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Unit Aktif"
            type="number"
            value={unitInput}
            onChange={(e) => setUnitInput(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Assign Asisten ID"
            value={assignAsistenId}
            onChange={(e) => setAssignAsistenId(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Tanggal Mulai (YYYY-MM-DD)"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Sharing (nama, pisahkan koma)"
            value={sharingInput}
            onChange={(e) => setSharingInput(e.target.value)}
            className="text-sm"
          />
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleActivateService}
          >
            Aktifkan Layanan
          </Button>

          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">Top-up Unit</p>
            <div className="flex gap-2">
              <Input
                placeholder="ID Layanan"
                value={topupServiceId}
                onChange={(e) => setTopupServiceId(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Tambahan Unit"
                type="number"
                value={topupUnit}
                onChange={(e) => setTopupUnit(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleTopup}>
                Top-up
              </Button>
            </div>
          </div>
        </div>
      </SectionCollapsible>

      {/* Layanan Aktif */}
      <SectionCollapsible title={`📋 Layanan Aktif (${activeServices.length})`}>
        {Object.entries(servicesByType).map(([tipe, services]) => (
          <div key={tipe} className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{tipe}</p>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <Input
                placeholder={`Filter ${tipe}`}
                value={searchLayanan[tipe] || ""}
                onChange={(e) => setSearchLayanan((prev) => ({ ...prev, [tipe]: e.target.value }))}
                className="pl-7 h-7 text-xs"
              />
            </div>
            {services
              .filter(
                (s) =>
                  !searchLayanan[tipe] ||
                  s.idService.toLowerCase().includes(searchLayanan[tipe].toLowerCase()) ||
                  s.clientName.toLowerCase().includes(searchLayanan[tipe].toLowerCase())
              )
              .map((s) => (
                <div key={s.idService} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
                  <p className="text-sm font-medium text-slate-800">
                    {s.idService} – {s.clientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Unit Aktif: {s.unitAktif} | On Hold: {s.unitOnHold}
                  </p>
                  <p className="text-xs text-slate-500">
                    Asisten: {s.assignAsistenId} | Mulai: {s.tanggalMulai}
                  </p>
                  {s.sharing.length > 0 && (
                    <p className="text-xs text-slate-400">
                      Sharing: {s.sharing.map((sh) => sh.name).join(", ")}
                    </p>
                  )}
                </div>
              ))}
          </div>
        ))}
      </SectionCollapsible>

      {/* Permintaan Withdraw */}
      <SectionCollapsible title={`💸 Permintaan Withdraw Partner (${withdrawRequests.filter((w) => w.status === "Pending").length} pending)`}>
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          <Input
            placeholder="Filter withdraw"
            value={searchWithdraw}
            onChange={(e) => setSearchWithdraw(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
        {withdrawRequests
          .filter(
            (w) =>
              !searchWithdraw ||
              w.partner.toLowerCase().includes(searchWithdraw.toLowerCase()) ||
              w.id.toLowerCase().includes(searchWithdraw.toLowerCase())
          )
          .map((w) => (
            <div key={w.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">
                    {w.id} – {w.partner}
                  </p>
                  <p className="text-xs text-slate-500">
                    {w.amount} | {w.bank}
                  </p>
                  <p className="text-xs text-slate-400">{w.date}</p>
                  <StatusBadge status={w.status} />
                </div>
                {w.status === "Pending" && (
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
                      onClick={() => handleWithdrawAction(w.id, "Approved")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs h-7 px-2"
                      onClick={() => handleWithdrawAction(w.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </SectionCollapsible>

      {/* Permintaan Perubahan Data Financial */}
      <SectionCollapsible title={`🔄 Permintaan Perubahan Data Financial (${perubahanData.filter((p) => p.status === "Pending").length} pending)`}>
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          <Input
            placeholder="Filter perubahan"
            value={searchPerubahan}
            onChange={(e) => setSearchPerubahan(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
        {perubahanData
          .filter(
            (p) =>
              !searchPerubahan ||
              p.partner.toLowerCase().includes(searchPerubahan.toLowerCase()) ||
              p.id.toLowerCase().includes(searchPerubahan.toLowerCase())
          )
          .map((p) => (
            <div key={p.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">
                    {p.id} – {p.partner}
                  </p>
                  <p className="text-xs text-slate-500">Field: {p.field}</p>
                  <p className="text-xs text-slate-500">
                    Lama: <span className="line-through text-red-400">{p.lama}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Baru: <span className="text-emerald-600 font-medium">{p.baru}</span>
                  </p>
                  <p className="text-xs text-slate-400">{p.date}</p>
                  <StatusBadge status={p.status} />
                </div>
                {p.status === "Pending" && (
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
                      onClick={() => handlePerubahanAction(p.id, "Approved")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs h-7 px-2"
                      onClick={() => handlePerubahanAction(p.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </SectionCollapsible>

      {/* Tiket Finance */}
      <SectionCollapsible title={`🎫 Tiket (${financeTickets.length})`}>
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          <Input
            placeholder="Filter tiket"
            value={searchFinanceTicket}
            onChange={(e) => setSearchFinanceTicket(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
        {financeTickets
          .filter(
            (t) =>
              !searchFinanceTicket ||
              t.id.toLowerCase().includes(searchFinanceTicket.toLowerCase()) ||
              t.user.toLowerCase().includes(searchFinanceTicket.toLowerCase()) ||
              t.subject.toLowerCase().includes(searchFinanceTicket.toLowerCase())
          )
          .map((t) => (
            <div key={t.id} className="border border-slate-200 p-3 rounded-lg mb-2 bg-white shadow-sm">
              <p className="text-sm font-medium text-slate-800">
                {t.id} – {t.user}
              </p>
              <p className="text-xs text-slate-500">{t.subject}</p>
              <p className="text-xs text-slate-400">{t.date}</p>
              <StatusBadge status={t.status} />
            </div>
          ))}
      </SectionCollapsible>

      {/* History Finance */}
      <SectionCollapsible title="📋 History">
        <div className="space-y-2">
          {serviceHistory.map((h) => (
            <div key={h.idService} className="border border-slate-200 p-3 rounded-lg bg-white shadow-sm">
              <p className="text-sm font-medium text-slate-800">
                {h.idService} – {h.clientName}
              </p>
              <p className="text-xs text-slate-500">
                {h.tipeLayanan} | {h.unit} unit | {h.tanggal}
              </p>
              <StatusBadge status={h.status} />
            </div>
          ))}
          {serviceHistory.length === 0 && (
            <p className="text-slate-500 text-sm py-2">Belum ada history</p>
          )}
        </div>
      </SectionCollapsible>
    </div>
  );
}

// ─── Main InternalDashboard Page ──────────────────────────────────────────────

export default function InternalDashboard() {
  const navigate = useNavigate();

  // Simulated role — in production this would come from auth context
  const [currentRole, setCurrentRole] = useState<
    "AdminUser" | "Asistenmu" | "AdminFinance" | "Superadmin"
  >("Superadmin");

  const showAdminUser = currentRole === "AdminUser" || currentRole === "Superadmin";
  const showAsitenmu = currentRole === "Asistenmu" || currentRole === "Superadmin";
  const showAdminFinance = currentRole === "AdminFinance" || currentRole === "Superadmin";

  return (
    <DashboardShell
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard Internal</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Role:{" "}
              <span className="font-semibold text-teal-600">{currentRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Role switcher for demo */}
            <Select
              value={currentRole}
              onValueChange={(v) =>
                setCurrentRole(v as "AdminUser" | "Asistenmu" | "AdminFinance" | "Superadmin")
              }
            >
              <SelectTrigger className="h-8 text-xs w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Superadmin">Superadmin</SelectItem>
                <SelectItem value="AdminUser">AdminUser</SelectItem>
                <SelectItem value="Asistenmu">Asistenmu</SelectItem>
                <SelectItem value="AdminFinance">AdminFinance</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate({ to: "/" })}
            >
              Keluar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* AdminUser Section */}
        {showAdminUser && (
          <section>
            {currentRole === "Superadmin" && (
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 bg-teal-500 rounded-full" />
                <h2 className="text-base font-bold text-slate-700">Admin User Dashboard</h2>
              </div>
            )}
            <AdminUserDashboard />
          </section>
        )}

        {/* Asistenmu Section */}
        {showAsitenmu && (
          <section>
            {currentRole === "Superadmin" && (
              <div className="flex items-center gap-2 mb-4 mt-2">
                <div className="h-1 w-6 bg-blue-500 rounded-full" />
                <h2 className="text-base font-bold text-slate-700">Asistenmu Dashboard</h2>
              </div>
            )}
            <AsistenmuDashboard />
          </section>
        )}

        {/* AdminFinance Section */}
        {showAdminFinance && (
          <section>
            {currentRole === "Superadmin" && (
              <div className="flex items-center gap-2 mb-4 mt-2">
                <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                <h2 className="text-base font-bold text-slate-700">Admin Finance Dashboard</h2>
              </div>
            )}
            <AdminFinanceDashboard />
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
