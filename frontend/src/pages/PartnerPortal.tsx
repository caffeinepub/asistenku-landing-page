import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterPartner, useGetUserRole } from "../hooks/useQueries";

export default function PartnerPortal() {
  const { login, identity, isLoggingIn, isInitializing } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const principalId = identity?.getPrincipal().toString() ?? "";

  // Frontend-only guest state — set immediately after login, no backend check
  const [isGuest, setIsGuest] = useState(false);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [kota, setKota] = useState("");

  const [successData, setSuccessData] = useState<{ idUser: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dashboard partner role check state
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  const registerPartner = useRegisterPartner();
  const getUserRole = useGetUserRole();

  // Set guest state immediately when logged in — no backend role check
  useEffect(() => {
    if (isLoggedIn) {
      setIsGuest(true);
    } else {
      setIsGuest(false);
      setSuccessData(null);
      setErrorMessage(null);
      setDashboardError(null);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (!isLoggedIn) {
      login();
    }
  };

  const handleDaftarPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !principalId) return;
    setSuccessData(null);
    setErrorMessage(null);

    try {
      const result = await registerPartner.mutateAsync({
        principalId,
        nama: nama.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        kota: kota.trim(),
      });

      if (result.ok) {
        setSuccessData({ idUser: result.idUser });
        setNama("");
        setEmail("");
        setWhatsapp("");
        setKota("");
      } else {
        setErrorMessage(result.message || "Pendaftaran gagal. Coba lagi.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal. Coba lagi.";
      setErrorMessage(msg);
    }
  };

  const handleMasukDashboard = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    setDashboardError(null);
    setIsCheckingRole(true);

    try {
      const role = await getUserRole.mutateAsync();
      if (role === "partner") {
        window.location.href = "/dashboard/partner";
      } else if (!role) {
        setDashboardError("Akun Anda belum terdaftar sebagai partner. Silakan daftar terlebih dahulu.");
      } else {
        setDashboardError("Akun Anda tidak memiliki akses sebagai partner.");
      }
    } catch {
      setDashboardError("Gagal memeriksa role. Coba lagi.");
    } finally {
      setIsCheckingRole(false);
    }
  };

  const isFormEnabled = isLoggedIn && isGuest;
  const isFormDisabled = !isFormEnabled || registerPartner.isPending;
  const isLoginBusy = isLoggingIn || isInitializing;
  const isMasukBusy = isCheckingRole || getUserRole.isPending;

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <div className="flex flex-col gap-10">

        {/* ── Card 1: Login II — Top Center ─────────────────────────────── */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Login Internet Identity
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Login terlebih dahulu untuk mendaftar sebagai partner atau mengakses dashboard.
            </p>

            {isLoggedIn && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-sm font-medium text-green-800">
                  {isGuest
                    ? "✓ Login berhasil — silakan isi form pendaftaran"
                    : "✓ Login berhasil"}
                </p>
                <p className="mt-1 break-all text-xs text-gray-400">{principalId}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoggedIn || isLoginBusy}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoginBusy ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghubungkan...
                </span>
              ) : isLoggedIn ? (
                "Sudah Login"
              ) : (
                "Login II"
              )}
            </button>
          </div>
        </div>

        {/* ── Cards 2 & 3: Dashboard Partner (left) + Form Pendaftaran (right) ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">

          {/* Card 3: Dashboard Partner — Left on Desktop, Order 2 on Mobile */}
          <div className="order-2 md:order-1">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold">Dashboard Partner</h2>
              <p className="mb-6 text-sm text-gray-600">
                Akses dashboard partner Anda untuk melihat task, riwayat, dan informasi akun.
              </p>

              {/* Dashboard error message */}
              {dashboardError && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm">{dashboardError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleMasukDashboard}
                disabled={!isLoggedIn || isMasukBusy}
                className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMasukBusy ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memeriksa...
                  </span>
                ) : (
                  "Masuk Dashboard Partner"
                )}
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  Login II terlebih dahulu untuk mengaktifkan tombol ini.
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Form Pendaftaran Partner — Right on Desktop, Order 1 on Mobile */}
          <div className="order-1 md:order-2">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-2 text-2xl font-bold">Form Pendaftaran Partner</h2>
              <p className="mb-6 text-sm text-gray-500">
                Daftarkan diri Anda sebagai partner Asistenku. Login terlebih dahulu untuk mengisi form.
              </p>

              {/* Success State */}
              {successData && (
                <div className="mb-6 rounded-lg bg-green-50 px-4 py-4 text-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="font-semibold">Pendaftaran berhasil!</p>
                      <p className="mt-1 text-sm">
                        ID Partner Anda:{" "}
                        <span className="font-mono font-bold">{successData.idUser}</span>
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        Simpan ID ini. Akun Anda sedang menunggu aktivasi oleh admin.
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

              <form onSubmit={handleDaftarPartner} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    disabled={isFormDisabled}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isFormDisabled}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={isFormDisabled}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Kota Domisili
                  </label>
                  <input
                    type="text"
                    placeholder="Kota tempat tinggal"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    disabled={isFormDisabled}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    isFormDisabled ||
                    !nama.trim() ||
                    !email.trim() ||
                    !whatsapp.trim() ||
                    !kota.trim()
                  }
                  className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {registerPartner.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mendaftar...
                    </span>
                  ) : (
                    "Daftar sebagai Partner"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
