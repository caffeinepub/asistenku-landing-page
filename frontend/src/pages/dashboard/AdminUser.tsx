import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetAllUsers,
  useActiveClients,
  useActivePartners,
  useActiveAsistenmu,
  useActiveInternalStaff,
} from '../../hooks/useQueries';
import DashboardShell from '../../components/layout/DashboardShell';
import { useQueryClient } from '@tanstack/react-query';

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  adminuser: 'bg-orange-100 text-orange-700',
  adminfinance: 'bg-yellow-100 text-yellow-700',
  concierge: 'bg-purple-100 text-purple-700',
  asistenmu: 'bg-blue-100 text-blue-700',
  client: 'bg-teal-100 text-teal-700',
  partner: 'bg-green-100 text-green-700',
  guest: 'bg-gray-100 text-gray-500',
};

export default function AdminUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();

  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: clients } = useActiveClients();
  const { data: partners } = useActivePartners();
  const { data: asistenmu } = useActiveAsistenmu();
  const { data: internalStaff } = useActiveInternalStaff();

  const [filterRole, setFilterRole] = useState<string>('all');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const filteredUsers = (users ?? []).filter((u) =>
    filterRole === 'all' ? true : u.role === filterRole
  );

  const clientCount = clients?.length ?? 0;
  const partnerCount = partners?.length ?? 0;
  const asistenmuCount = asistenmu?.length ?? 0;
  const staffCount = internalStaff?.length ?? 0;

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8" />
        <div>
          <h1 className="font-bold text-navy-900 text-lg">Admin User</h1>
          <p className="text-xs text-gray-400">Manajemen pengguna</p>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Klien', value: clientCount, color: 'bg-teal-50 text-teal-700' },
            { label: 'Partner', value: partnerCount, color: 'bg-green-50 text-green-700' },
            { label: 'Asistenmu', value: asistenmuCount, color: 'bg-blue-50 text-blue-700' },
            { label: 'Staff Internal', value: staffCount, color: 'bg-orange-50 text-orange-700' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <p className="text-xs font-medium opacity-70">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {['all', 'admin', 'adminuser', 'adminfinance', 'concierge', 'asistenmu', 'client', 'partner'].map(
            (role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterRole === role
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {role === 'all' ? 'Semua' : role}
              </button>
            )
          )}
        </div>

        {/* User List */}
        {usersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Tidak ada pengguna ditemukan.</p>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.idUser}
                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-navy-900 truncate">{user.nama}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.whatsapp}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      roleColors[user.role] ?? 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {user.role}
                  </span>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
