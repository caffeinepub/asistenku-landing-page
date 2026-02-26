import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetUserByPrincipalMutation,
  useRegisterUser,
  useClaimAdmin,
  useIsAdminClaimed,
} from '../hooks/useQueries';
import { Role } from '../backend';

export default function InternalPortal() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const [principalInput, setPrincipalInput] = useState('');
  const [lookupResult, setLookupResult] = useState<{ nama: string; role: string; status: string } | null>(null);
  const [lookupError, setLookupError] = useState('');

  const [registerForm, setRegisterForm] = useState({
    principalId: '',
    nama: '',
    email: '',
    whatsapp: '',
  });
  const [registerSuccess, setRegisterSuccess] = useState('');

  const { data: isAdminClaimed } = useIsAdminClaimed();
  const claimAdmin = useClaimAdmin();
  const getUserByPrincipal = useGetUserByPrincipalMutation();
  const registerUser = useRegisterUser();

  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    await clear();
  };

  const handleLookup = async () => {
    setLookupError('');
    setLookupResult(null);
    try {
      const result = await getUserByPrincipal.mutateAsync(principalInput);
      if (result) {
        setLookupResult({ nama: result.nama, role: result.role, status: result.status });
      } else {
        setLookupError('Principal tidak ditemukan.');
      }
    } catch {
      setLookupError('Gagal mencari principal. Pastikan Anda memiliki akses.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess('');
    try {
      const result = await registerUser.mutateAsync({
        principalId: registerForm.principalId,
        nama: registerForm.nama,
        email: registerForm.email,
        whatsapp: registerForm.whatsapp,
        role: Role.adminuser,
        sharePercentage: BigInt(0),
      });
      if (result.ok) {
        setRegisterSuccess(`Staff berhasil didaftarkan. ID: ${result.idUser}`);
        setRegisterForm({ principalId: '', nama: '', email: '', whatsapp: '' });
      }
    } catch {
      setRegisterSuccess('Gagal mendaftarkan staff.');
    }
  };

  const handleClaimAdmin = async () => {
    try {
      await claimAdmin.mutateAsync();
    } catch (err) {
      console.error('Claim admin error:', err);
    }
  };

  const handleNavigateToDashboard = () => {
    navigate({ to: '/dashboard/internal' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg flex flex-col gap-6">
        <div className="text-center">
          <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-900">Portal Internal</h1>
          <p className="text-gray-500 text-sm mt-1">Akses khusus tim internal Asistenku</p>
        </div>

        {/* Auth Section */}
        <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-navy-900 text-sm">Status Login</h2>
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 break-all">
                Principal: {identity?.getPrincipal().toString()}
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleNavigateToDashboard} className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                  Masuk Dashboard
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full"
            >
              {isLoggingIn ? 'Menghubungkan...' : 'Login dengan Internet Identity'}
            </Button>
          )}
        </div>

        {/* Claim Admin */}
        {isAuthenticated && !isAdminClaimed && (
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col gap-3">
            <h2 className="font-semibold text-amber-800 text-sm">Setup Admin Pertama</h2>
            <p className="text-xs text-amber-700">
              Belum ada admin. Klaim posisi admin dengan principal Anda saat ini.
            </p>
            <Button
              size="sm"
              onClick={handleClaimAdmin}
              disabled={claimAdmin.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {claimAdmin.isPending ? 'Memproses...' : 'Klaim Admin'}
            </Button>
          </div>
        )}

        {/* Principal Lookup */}
        {isAuthenticated && (
          <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
            <h2 className="font-semibold text-navy-900 text-sm">Cari User by Principal</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Principal ID..."
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={handleLookup}
                disabled={!principalInput || getUserByPrincipal.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
              >
                {getUserByPrincipal.isPending ? '...' : 'Cari'}
              </Button>
            </div>
            {lookupResult && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Nama:</span> {lookupResult.nama}</p>
                <p><span className="font-medium">Role:</span> {lookupResult.role}</p>
                <p><span className="font-medium">Status:</span> {lookupResult.status}</p>
              </div>
            )}
            {lookupError && <p className="text-xs text-red-500">{lookupError}</p>}
          </div>
        )}

        {/* Register Staff */}
        {isAuthenticated && (
          <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
            <h2 className="font-semibold text-navy-900 text-sm">Daftarkan Staff Internal</h2>
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="staff-principal" className="text-xs">Principal ID</Label>
                <Input
                  id="staff-principal"
                  placeholder="Principal ID staff..."
                  value={registerForm.principalId}
                  onChange={(e) => setRegisterForm({ ...registerForm, principalId: e.target.value })}
                  className="mt-1 text-xs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="staff-nama" className="text-xs">Nama</Label>
                <Input
                  id="staff-nama"
                  placeholder="Nama staff..."
                  value={registerForm.nama}
                  onChange={(e) => setRegisterForm({ ...registerForm, nama: e.target.value })}
                  className="mt-1 text-xs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="staff-email" className="text-xs">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="staff-wa" className="text-xs">WhatsApp</Label>
                <Input
                  id="staff-wa"
                  placeholder="08xxxxxxxxxx"
                  value={registerForm.whatsapp}
                  onChange={(e) => setRegisterForm({ ...registerForm, whatsapp: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={registerUser.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {registerUser.isPending ? 'Mendaftarkan...' : 'Daftarkan Staff'}
              </Button>
              {registerSuccess && (
                <p className={`text-xs ${registerSuccess.startsWith('Gagal') ? 'text-red-500' : 'text-teal-600'}`}>
                  {registerSuccess}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
