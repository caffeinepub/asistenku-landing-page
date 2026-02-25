import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterClient } from "../hooks/useQueries";

export default function ClientRegister() {
  const { login, identity, isLoggingIn, isInitializing } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const principalId = identity?.getPrincipal().toString() ?? "";

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");

  const [successData, setSuccessData] = useState<{ idUser: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerClient = useRegisterClient();

  // Reset result messages when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setSuccessData(null);
      setErrorMessage(null);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (!isLoggedIn) {
      login();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !principalId) return;
    setSuccessData(null);
    setErrorMessage(null);

    try {
      const result = await registerClient.mutateAsync({
        principalId,
        nama: nama.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        company: company.trim() || "-",
      });

      if (result.ok) {
        setSuccessData({ idUser: result.idUser });
        setNama("");
        setEmail("");
        setWhatsapp("");
        setCompany("");
      } else {
        setErrorMessage(result.message || "Pendaftaran gagal. Coba lagi.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal. Coba lagi.";
      setErrorMessage(msg);
    }
  };

  const isFormDisabled = !isLoggedIn || registerClient.isPending;
  const isLoginBusy = isLoggingIn || isInitializing;

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <div className="w-full max-w-[650px] rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold">Form Pendaftaran Client</h2>
          <p className="mb-6 text-sm text-gray-500">
            Daftarkan diri Anda sebagai client Asistenku. Login terlebih dahulu untuk mengisi form.
          </p>

          {/* Success State */}
          {successData && (
            <div className="mb-6 rounded-lg bg-green-50 px-4 py-4 text-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="font-semibold">Pendaftaran berhasil!</p>
                  <p className="mt-1 text-sm">
                    ID Client Anda:{" "}
                    <span className="font-mono font-bold">{successData.idUser}</span>
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Simpan ID ini. Akun Anda sedang menunggu aktivasi oleh admin sebelum bisa masuk dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-4 text-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Field */}
            <div>
              <label htmlFor="nama" className="mb-2 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                id="nama"
                type="text"
                placeholder="Nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isFormDisabled}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFormDisabled}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* WhatsApp Field */}
            <div>
              <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                type="text"
                placeholder="08xxxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={isFormDisabled}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Company Field (Optional) */}
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                Company <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                id="company"
                type="text"
                placeholder="Nama perusahaan"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isFormDisabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isFormDisabled ||
                !nama.trim() ||
                !email.trim() ||
                !whatsapp.trim()
              }
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerClient.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftar...
                </span>
              ) : (
                "Submit"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-2">atau</span>
              </div>
            </div>

            {/* Login II Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggedIn || isLoginBusy}
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoginBusy ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghubungkan...
                </span>
              ) : isLoggedIn ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  Sudah Login
                </span>
              ) : (
                "Login Internet Identity (Login II)"
              )}
            </button>

            {isLoggedIn && (
              <p className="break-all text-center text-xs text-gray-400">
                Principal: {principalId}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
