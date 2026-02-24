import React from "react";

interface DashboardShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({ header, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Custom Header */}
      {header}

      {/* Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-6 text-sm text-gray-500 text-center">
          Asistenku © 2026 PT. Asistenku Digital Indonesia
        </div>
      </footer>
    </div>
  );
}
