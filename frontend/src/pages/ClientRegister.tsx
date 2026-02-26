import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterClient } from '../hooks/useQueries';

export default function ClientRegister() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const registerClient = useRegisterClient();

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
  });
  const [step, setStep] = useState<'login' | 'register'>('login');
  const [successMsg, setSuccessMsg] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
      setStep('register');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const principalId = identity.getPrincipal().toString();

    try {
      await registerClient.mutateAsync({
        principalId,
        nama: formData.nama,
        email: formData.email,
        whatsapp: formData.whatsapp,
      });
      setSuccessMsg('Pendaftaran berhasil! Tim kami akan menghubungi Anda segera.');
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-900">Daftar sebagai Klien</h1>
          <p className="text-gray-500 text-sm mt-2">
            Mulai delegasikan pekerjaan Anda bersama Asistenku
          </p>
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
        ) : step === 'login' ? (
          <div className="flex flex-col gap-4">
            <p className="text-gray-600 text-sm text-center">
              Untuk mendaftar, Anda perlu login terlebih dahulu menggunakan Internet Identity.
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn || !!identity}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full"
            >
              {isLoggingIn ? 'Menghubungkan...' : identity ? 'Sudah Login' : 'Login dengan Internet Identity'}
            </Button>
            {identity && (
              <Button onClick={() => setStep('register')} variant="outline" className="w-full">
                Lanjut ke Pendaftaran
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
              disabled={registerClient.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full mt-2"
            >
              {registerClient.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
            {registerClient.isError && (
              <p className="text-xs text-red-500 text-center">
                Pendaftaran gagal. Silakan coba lagi.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
