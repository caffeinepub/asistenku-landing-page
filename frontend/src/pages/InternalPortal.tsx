import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIsAdminClaimed,
  useClaimAdmin,
  useRegisterUser,
  useGetUserByPrincipal,
} from "../hooks/useQueries";
import { Loader2, CheckCircle } from "lucide-react";

const ALLOWED_ROLES = ["admin", "adminuser", "adminfinance", "concierge", "asistenmu"];

export default function InternalPortal() {
  const navigate = useNavigate();
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const principalId = identity?.getPrincipal().toString() ?? "";
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  // Form state
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Result messages
  const [registerResult, setRegisterResult] = useState<{
    ok: boolean;
    message: string;
    idUser?: string;
  } | null>(null);
  const [dashboardMessage, setDashboardMessage] = useState<string | null>(null);

  // Backend hooks
  const { data: adminClaimed, isLoading: isCheckingClaim } = useIsAdminClaimed();
  const claimAdmin = useClaimAdmin();
  const registerUser = useRegisterUser();
  const getUserByPrincipal = useGetUserByPrincipal();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = () => {
    if (isLoggedIn) {
      clear();
      setRegisterResult(null);
      setDashboardMessage(null);
    } else {
      login();
    }
  };

  const handleClaimAdmin = async () => {
    if (!principalId) return;
    try {
      await claimAdmin.mutateAsync();
    } catch {
      // error state handled by claimAdmin.isError
    }
  };

  const handleRegister = async () => {
    if (!principalId || !nama.trim() || !email.trim() || !whatsapp.trim()) return;
    setRegisterResult(null);
    try {
      const result = await registerUser.mutateAsync({
        principalId,
        nama: nama.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
      });
      setRegisterResult({
        ok: result.ok,
        message: result.message,
        idUser: result.idUser,
      });
      if (result.ok) {
        setNama("");
        setEmail("");
        setWhatsapp("");
      }
    } catch {
      setRegisterResult({ ok: false, message: "Pendaftaran gagal. Coba lagi." });
    }
  };

  const handleMasukDashboard = async () => {
    if (!principalId) return;
    setDashboardMessage(null);
    try {
      const user = await getUserByPrincipal.mutateAsync(principalId);
      if (!user) {
        setDashboardMessage("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
        return;
      }
      if (ALLOWED_ROLES.includes(user.role) && user.status === "active") {
        navigate({ to: "/dashboard/internal" });
      } else {
        setDashboardMessage(
          "Akun Anda sedang menunggu persetujuan. Silakan hubungi admin."
        );
      }
    } catch {
      setDashboardMessage("Gagal memeriksa akun. Coba lagi.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const loginButtonLabel = isLoggingIn
    ? "Menghubungkan..."
    : isInitializing
    ? "Memuat..."
    : isLoggedIn
    ? "Logout"
    : "Login II";

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <div className="flex flex-col gap-10">
        {/* Login II Card - Top Center */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Login Internet Identity
            </h2>
            {isLoggedIn && (
              <p className="mb-4 break-all text-center text-xs text-gray-500">
                Principal: {principalId}
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn || isInitializing}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingIn || isInitializing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loginButtonLabel}
                </span>
              ) : (
                loginButtonLabel
              )}
            </button>
          </div>
        </div>

        {/* Dashboard + Form Pendaftaran - Side by Side on Desktop with Equal Widths */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Dashboard Card - Left on Desktop */}
          <div className="order-2 md:order-1">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">Dashboard Internal</h2>
              <p className="mb-6 text-gray-700">
                Jika Anda belum memiliki akun internal, silakan mendaftar lewat
                form di kanan
              </p>
              {dashboardMessage && (
                <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {dashboardMessage}
                </p>
              )}
              <button
                disabled={!isLoggedIn || getUserByPrincipal.isPending}
                onClick={handleMasukDashboard}
                className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {getUserByPrincipal.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memeriksa...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </div>
          </div>

          {/* Form Pendaftaran Card - Right on Desktop */}
          <div className="order-1 md:order-2">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">Form Pendaftaran</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  disabled={!isLoggedIn || registerUser.isPending}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isLoggedIn || registerUser.isPending}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  disabled={!isLoggedIn || registerUser.isPending}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                {registerResult && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      registerResult.ok
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {registerResult.ok ? (
                      <>
                        <p className="font-semibold">Pendaftaran berhasil!</p>
                        <p>
                          ID Anda:{" "}
                          <span className="font-mono font-bold">
                            {registerResult.idUser}
                          </span>
                        </p>
                        <p className="mt-1 text-xs">
                          Simpan ID ini. Akun Anda sedang menunggu aktivasi oleh
                          admin.
                        </p>
                      </>
                    ) : (
                      <p>{registerResult.message}</p>
                    )}
                  </div>
                )}
                <button
                  disabled={
                    !isLoggedIn ||
                    registerUser.isPending ||
                    !nama.trim() ||
                    !email.trim() ||
                    !whatsapp.trim()
                  }
                  onClick={handleRegister}
                  className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {registerUser.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mendaftar...
                    </span>
                  ) : (
                    "Daftar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Admin Card - Bottom Center */}
        {!isCheckingClaim && !adminClaimed && (
          <div className="mx-auto w-full max-w-[650px]">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-2 text-center text-2xl font-bold">
                Claim Admin
              </h2>
              <p className="mb-6 text-center text-sm text-gray-500">
                Jadilah admin pertama. Akun Anda akan langsung aktif.
              </p>

              {/* Success state */}
              {claimAdmin.isSuccess && claimAdmin.data?.ok && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Berhasil! Anda sekarang adalah Admin. Silakan masuk ke Dashboard.</span>
                </div>
              )}

              {/* Backend returned ok=false (admin already claimed) */}
              {claimAdmin.isSuccess && !claimAdmin.data?.ok && (
                <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {claimAdmin.data?.message}
                </p>
              )}

              {/* Network/actor error */}
              {claimAdmin.isError && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                  Gagal melakukan claim. Pastikan Anda sudah login dan coba lagi.
                </p>
              )}

              <button
                disabled={!isLoggedIn || claimAdmin.isPending || (claimAdmin.isSuccess && claimAdmin.data?.ok)}
                onClick={handleClaimAdmin}
                className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {claimAdmin.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </span>
                ) : claimAdmin.isSuccess && claimAdmin.data?.ok ? (
                  "Admin Berhasil Diklaim ✓"
                ) : (
                  "Claim Admin"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
