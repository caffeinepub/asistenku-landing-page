import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterPartner, useGetUserRole } from '../hooks/useQueries';

export default function PartnerPortal() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const registerPartner = useRegisterPartner();
  const getUserRole = useGetUserRole();

  const [step, setStep] = useState<'auth' | 'register' | 'dashboard'>('auth');
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [roleError, setRoleError] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleCheckRole = async () => {
    setRoleError('');
    try {
      const role = await getUserRole.mutateAsync();
      if (role && role === 'partner') {
        navigate({ to: '/dashboard/partner' });
      } else if (role) {
        setRoleError(`Akun Anda terdaftar sebagai ${role}, bukan partner.`);
      } else {
        setStep('register');
      }
    } catch {
      setRoleError('Gagal memeriksa role. Coba lagi.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const principalId = identity.getPrincipal().toString();

    try {
      await registerPartner.mutateAsync({
        principalId,
        nama: formData.nama,
        email: formData.email,
        whatsapp: formData.whatsapp,
      });
      setSuccessMsg('Pendaftaran berhasil! Tim kami akan memverifikasi profil Anda.');
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-900">Portal Partner</h1>
          <p className="text-gray-500 text-sm mt-1">Login atau daftar sebagai Partner Asistenku</p>
        </div>

        {successMsg ? (
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-teal-600 font-semibold mb-2">{successMsg}</p>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="mt-4"
            >
              Kembali ke Beranda
            </Button>
          </div>
        ) : step === 'auth' ? (
          <div className="flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <p className="text-gray-600 text-sm text-center">
                  Login untuk mengakses dashboard partner atau mendaftar sebagai partner baru.
                </p>
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                >
                  {isLoggingIn ? 'Menghubungkan...' : 'Login dengan Internet Identity'}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 text-center break-all">
                  Principal: {identity?.getPrincipal().toString()}
                </p>
                <Button
                  onClick={handleCheckRole}
                  disabled={getUserRole.isPending}
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                >
                  {getUserRole.isPending ? 'Memeriksa...' : 'Masuk Ruang Kerja'}
                </Button>
                {roleError && <p className="text-xs text-red-500 text-center">{roleError}</p>}
                <Button
                  variant="outline"
                  onClick={() => setStep('register')}
                  className="w-full"
                >
                  Daftar sebagai Partner Baru
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clear()}
                  className="text-gray-400 text-xs"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <h2 className="font-semibold text-navy-900">Daftar Partner Baru</h2>
            <div>
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                placeholder="Nama Anda"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="08xxxxxxxxxx"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={registerPartner.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full mt-2"
            >
              {registerPartner.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
            {registerPartner.isError && (
              <p className="text-xs text-red-500 text-center">
                Pendaftaran gagal. Silakan coba lagi.
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep('auth')}
              className="text-gray-400 text-xs"
            >
              Kembali
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
