import { useState } from "react";

export default function PartnerPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <div className="flex flex-col gap-10">
        {/* Login II Card - Top Center */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Login Internet Identity
            </h2>
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Login II
            </button>
          </div>
        </div>

        {/* Dashboard Partner + Form Pendaftaran Partner - Side by Side on Desktop with Equal Widths */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Dashboard Partner Card - Left on Desktop, Order 2 on Mobile */}
          <div className="order-2 md:order-1">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">Dashboard Partner</h2>
              <p className="mb-6 text-gray-700">
                Jika Anda belum memiliki akun partner, silakan mendaftar lewat
                form di kanan
              </p>
              <button
                disabled={!isLoggedIn}
                className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Masuk
              </button>
            </div>
          </div>

          {/* Form Pendaftaran Partner Card - Right on Desktop, Order 1 on Mobile */}
          <div className="order-1 md:order-2">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">
                Form Pendaftaran Partner
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama"
                  disabled={!isLoggedIn}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  disabled={!isLoggedIn}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="WhatsApp"
                  disabled={!isLoggedIn}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Kota Domisili"
                  disabled={!isLoggedIn}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  disabled={!isLoggedIn}
                  className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
