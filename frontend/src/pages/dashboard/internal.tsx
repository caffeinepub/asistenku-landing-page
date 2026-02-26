import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, LogOut, UserPlus, Shield } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetCallerUserProfile,
  useGetAllUsers,
  useRegisterUser,
} from '../../hooks/useQueries';
import { Role, UserProfile } from '../../backend';
import { useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../components/layout/DashboardShell';
import AdminUserDashboard from './AdminUser';
import FinanceDashboard from './finance';
import AsistenmuDashboard from './Asistenmu';

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

function UserManagementSection() {
  const { data: users, isLoading, refetch } = useGetAllUsers();
  const registerUser = useRegisterUser();
  const { identity } = useInternetIdentity();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    principalId: string;
    nama: string;
    email: string;
    whatsapp: string;
    role: Role;
    sharePercentage: string;
  }>({
    principalId: '',
    nama: '',
    email: '',
    whatsapp: '',
    role: Role.client,
    sharePercentage: '0',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    if (!identity) { setErrorMsg('Login terlebih dahulu.'); return; }
    try {
      const result = await registerUser.mutateAsync({
        principalId: formData.principalId,
        nama: formData.nama,
        email: formData.email,
        whatsapp: formData.whatsapp,
        role: formData.role,
        sharePercentage: BigInt(parseInt(formData.sharePercentage) || 0),
      });
      setSuccessMsg(`User berhasil didaftarkan. ID: ${result.idUser}`);
      setFormData({ principalId: '', nama: '', email: '', whatsapp: '', role: Role.client, sharePercentage: '0' });
      setShowForm(false);
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || 'Gagal mendaftarkan user.');
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{users?.length ?? 0} user terdaftar</p>
        <Button
          size="sm"
          onClick={() => setShowForm((v) => !v)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <UserPlus size={14} className="mr-1" />
          Daftarkan User
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleRegister} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 border border-gray-100">
          <h3 className="font-semibold text-sm text-navy-900">Daftarkan User Baru</h3>
          <div>
            <Label htmlFor="reg-principal" className="text-xs">Principal ID</Label>
            <Input
              id="reg-principal"
              placeholder="Principal ID user..."
              value={formData.principalId}
              onChange={(e) => setFormData({ ...formData, principalId: e.target.value })}
              className="mt-1 text-xs"
              required
            />
          </div>
          <div>
            <Label htmlFor="reg-nama" className="text-xs">Nama</Label>
            <Input
              id="reg-nama"
              placeholder="Nama lengkap..."
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="mt-1 text-xs"
              required
            />
          </div>
          <div>
            <Label htmlFor="reg-email" className="text-xs">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="email@contoh.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="reg-wa" className="text-xs">WhatsApp</Label>
            <Input
              id="reg-wa"
              placeholder="08xxxxxxxxxx"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v as Role })}
            >
              <SelectTrigger className="mt-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.client}>Client</SelectItem>
                <SelectItem value={Role.partner}>Partner</SelectItem>
                <SelectItem value={Role.asistenmu}>Asistenmu</SelectItem>
                <SelectItem value={Role.adminuser}>Admin User</SelectItem>
                <SelectItem value={Role.adminfinance}>Admin Finance</SelectItem>
                <SelectItem value={Role.concierge}>Concierge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="reg-share" className="text-xs">Share % (Partner)</Label>
            <Input
              id="reg-share"
              type="number"
              min="0"
              max="100"
              value={formData.sharePercentage}
              onChange={(e) => setFormData({ ...formData, sharePercentage: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
          {successMsg && <p className="text-xs text-teal-600">{successMsg}</p>}
          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={registerUser.isPending} className="bg-teal-600 hover:bg-teal-700 text-white">
              {registerUser.isPending ? 'Mendaftarkan...' : 'Daftarkan'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {(users ?? []).map((user: UserProfile) => (
            <div
              key={user.idUser}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-navy-900 truncate">{user.nama}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || user.whatsapp || user.idUser}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={user.status === 'active' ? 'default' : 'outline'} className="text-xs">
                  {user.status}
                </Badge>
                <span className="text-xs text-gray-400 capitalize">{user.role}</span>
              </div>
            </div>
          ))}
          {(users ?? []).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Tidak ada user.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function InternalDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <Shield size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-navy-900">Login diperlukan</p>
          <p className="text-sm text-gray-400 mt-1">Silakan login untuk mengakses dashboard internal.</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-2xl px-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <p className="font-semibold text-navy-900">Akses Ditolak</p>
          <p className="text-sm text-gray-400 mt-1">Profil tidak ditemukan. Hubungi admin.</p>
        </div>
      </div>
    );
  }

  const role = profile.role;
  const isAdmin = role === 'admin';
  const isAdminUser = role === 'adminuser';
  const isAdminFinance = role === 'adminfinance';
  const isAsitenmu = role === 'asistenmu';
  const isConcierge = role === 'concierge';

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8" />
        <div>
          <h1 className="font-bold text-navy-900 text-lg">Dashboard Internal</h1>
          <p className="text-xs text-gray-400 capitalize">{profile.nama} · {role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
        <Button size="sm" variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardShell header={header}>
      <div className="flex flex-col gap-4">
        {/* Admin: show all sections */}
        {isAdmin && (
          <>
            <SectionCard title="Admin User" defaultOpen>
              <AdminUserDashboard />
            </SectionCard>
            <SectionCard title="Finance">
              <FinanceDashboard />
            </SectionCard>
            <SectionCard title="Task Management (Asistenmu)">
              <AsistenmuDashboard />
            </SectionCard>
            <SectionCard title="Manajemen User">
              <UserManagementSection />
            </SectionCard>
          </>
        )}

        {/* AdminUser */}
        {isAdminUser && !isAdmin && (
          <>
            <AdminUserDashboard />
            <SectionCard title="Manajemen User" defaultOpen>
              <UserManagementSection />
            </SectionCard>
          </>
        )}

        {/* AdminFinance */}
        {isAdminFinance && !isAdmin && (
          <FinanceDashboard />
        )}

        {/* Asistenmu */}
        {isAsitenmu && !isAdmin && (
          <AsistenmuDashboard />
        )}

        {/* Concierge */}
        {isConcierge && !isAdmin && (
          <AsistenmuDashboard />
        )}
      </div>
    </DashboardShell>
  );
}
