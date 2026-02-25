import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetUserRole } from "../hooks/useQueries";

export default function ClientLogin() {
  const { login, identity, isLoggingIn, isInitializing } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const principalId = identity?.getPrincipal().toString() ?? "";

  const [notRegistered, setNotRegistered] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  const getUserRole = useGetUserRole();

  const isLoginBusy = isLoggingIn || isInitializing;

  // Reset not-registered state when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setNotRegistered(false);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (!isLoggedIn) {
      login();
    }
  };

  const handleMasukRuangKerja = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    setNotRegistered(false);
    setIsCheckingRole(true);

    try {
      const role = await getUserRole.mutateAsync();
      if (role === "client") {
        window.location.href = "/dashboard/client";
      } else {
        setNotRegistered(true);
      }
    } catch {
      setNotRegistered(true);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const isMasukBusy = isCheckingRole || getUserRole.isPending;

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <div className="flex flex-col gap-10">

        {/* ── Card 1: Login II ─────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Login Internet Identity
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Login dengan Internet Identity untuk melanjutkan.
            </p>

            {isLoggedIn && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-sm font-medium text-green-800">
                  ✓ Login berhasil
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

        {/* ── Card 2: Masuk Ruang Kerja ─────────────────────────────────── */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">
              Login untuk masuk ke Ruang Kerja kamu
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Akses dashboard client Anda untuk melihat task, status layanan, dan informasi akun.
            </p>

            {/* Not registered message */}
            {notRegistered && (
              <div className="mb-6 rounded-lg bg-amber-50 px-4 py-4 text-amber-800">
                <p className="text-sm font-medium">
                  User anda belum terdaftar, silahkan klik{" "}
                  <Link
                    to="/client-register"
                    className="font-bold underline hover:text-amber-900"
                  >
                    Daftar
                  </Link>
                </p>
              </div>
            )}

            <button
              onClick={handleMasukRuangKerja}
              disabled={!isLoggedIn || isMasukBusy}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMasukBusy ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memeriksa...
                </span>
              ) : (
                "Masuk Ruang Kerja"
              )}
            </button>

            {!isLoggedIn && (
              <p className="mt-3 text-center text-xs text-gray-400">
                Login II terlebih dahulu untuk mengaktifkan tombol ini.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
