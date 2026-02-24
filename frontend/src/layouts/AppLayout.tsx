import { Outlet } from '@tanstack/react-router';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
