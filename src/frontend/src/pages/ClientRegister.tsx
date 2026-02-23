import { useState } from "react";

export default function ClientRegister() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <div className="w-full max-w-[650px] rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Form Pendaftaran Client</h2>
          
          <div className="space-y-4">
            {/* Nama Field */}
            <div>
              <label htmlFor="nama" className="mb-2 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                id="nama"
                type="text"
                placeholder="Nama"
                disabled={!isLoggedIn}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
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
                placeholder="Email"
                disabled={!isLoggedIn}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
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
                placeholder="WhatsApp"
                disabled={!isLoggedIn}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Company Field (Optional) */}
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                Company <span className="text-gray-500">(opsional)</span>
              </label>
              <input
                id="company"
                type="text"
                placeholder="Company"
                disabled={!isLoggedIn}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={!isLoggedIn}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>

            {/* Login II Button */}
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="w-full rounded-lg border border-black bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-50"
            >
              Login Internet Identity (Login II)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
