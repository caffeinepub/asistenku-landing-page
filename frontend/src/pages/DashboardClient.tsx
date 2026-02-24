import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export default function DashboardClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const userName = "Budi Santoso";

  // Dummy data for services
  const services = [
    { name: "Website Development", status: "Active" },
    { name: "Social Media Management", status: "Active" },
    { name: "Admin Support", status: "Active" },
  ];

  // Dummy data for summary
  const summaryData = [
    { label: "Task Butuh Review Kamu", count: 2 },
    { label: "Task On Progress", count: 5 },
    { label: "Task On Revisi", count: 1 },
    { label: "Task Selesai", count: 12 },
  ];

  // Dummy data for tasks
  const allTasks = [
    {
      id: 1,
      title: "Desain Landing Page Produk Baru",
      serviceName: "TENANG",
      deadline: "25 Feb 2026",
      status: "Review",
    },
    {
      id: 2,
      title: "Konten Instagram Minggu Ini",
      serviceName: "RAPI",
      deadline: "28 Feb 2026",
      status: "On Progress",
    },
    {
      id: 3,
      title: "Update Database Customer",
      serviceName: "FOKUS",
      deadline: "22 Feb 2026",
      status: "Revisi",
    },
    {
      id: 4,
      title: "Laporan Keuangan Bulanan",
      serviceName: "JAGA",
      deadline: "20 Feb 2026",
      status: "Selesai",
    },
    {
      id: 5,
      title: "Riset Kompetitor Pasar",
      serviceName: "TENANG",
      deadline: "27 Feb 2026",
      status: "On Progress",
    },
  ];

  // Filter tasks based on status
  const filteredTasks = statusFilter === "Semua" 
    ? allTasks 
    : allTasks.filter(task => task.status === statusFilter);

  // Get badge styling based on status with metal reflection
  const getStatusBadgeClass = (status: string) => {
    const baseClass = "bg-white text-slate-700 rounded-full px-3 py-1 text-xs font-medium";
    switch (status) {
      case "Review":
        return `${baseClass} shadow-[0_1px_4px_rgba(212,175,55,0.18)]`;
      case "On Progress":
        return `${baseClass} shadow-[0_1px_4px_rgba(180,180,180,0.25)]`;
      case "Revisi":
        return `${baseClass} shadow-[0_1px_4px_rgba(205,127,50,0.18)]`;
      case "Selesai":
        return `${baseClass} shadow-[0_1px_4px_rgba(16,185,129,0.18)]`;
      default:
        return `${baseClass} shadow-[0_1px_4px_rgba(180,180,180,0.15)]`;
    }
  };

  // Get left accent color based on status
  const getStatusAccentClass = (status: string) => {
    switch (status) {
      case "Review":
        return "bg-amber-300/60";
      case "On Progress":
        return "bg-slate-400/50";
      case "Revisi":
        return "bg-orange-300/60";
      case "Selesai":
        return "bg-emerald-300/60";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <DashboardShell
      header={
        <header className="bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Left: Logo + Greeting */}
              <div className="flex items-center gap-4">
                <img
                  src="/assets/asistenku-horizontal.png"
                  alt="Asistenku"
                  className="h-8 w-auto"
                />
                <div className="hidden md:block">
                  <p className="text-xl font-semibold text-slate-900">
                    Halo, {userName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Apa yang kamu mau delegasikan hari ini?
                  </p>
                </div>
              </div>

              {/* Right: Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-all duration-300 ease-out hover:bg-slate-300">
                    <span className="text-sm font-semibold">
                      {userName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Logout II
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Greeting */}
            <div className="mt-3 md:hidden">
              <p className="text-xl font-semibold text-slate-900">
                Halo, {userName}
              </p>
              <p className="text-sm text-slate-500">
                Apa yang kamu mau delegasikan hari ini?
              </p>
            </div>
          </div>
        </header>
      }
    >
      <div className="relative min-h-screen bg-slate-50">
        {/* Soft Top Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-slate-200/40 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative space-y-12">
          {/* Section 1: Daftar Layanan Kamu */}
          <section>
            <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-medium text-slate-800">Daftar Layanan Kamu</h2>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-slate-900 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-md hover:bg-slate-800 transition-all duration-300 ease-out"
              >
                Buat Task Baru
              </Button>
            </div>
            
            <div className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out"
                >
                  <span className="text-sm font-medium text-slate-600">{service.name}</span>
                  <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-1 text-xs">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Summary */}
          <section>
            <h2 className="mb-6 text-lg font-medium text-slate-800">Summary</h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {summaryData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out"
                >
                  {/* Micro Accent Line */}
                  <div className="h-1 w-8 bg-slate-900 rounded-full mb-4 opacity-80" />
                  <div className="text-3xl font-semibold text-slate-900 tracking-tight">{item.count}</div>
                  <div className="text-sm text-slate-500 mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Daftar Task Kamu */}
          <section>
            <div className="rounded-2xl bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out">
              {/* Header with title and filter */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-medium text-slate-800">Daftar Task Kamu</h2>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="On Progress">On Progress</SelectItem>
                    <SelectItem value="Revisi">Revisi</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Task List or Empty State */}
              {filteredTasks.length > 0 ? (
                <div className="space-y-6">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                        index !== filteredTasks.length - 1 ? 'border-b border-slate-100 pb-6' : ''
                      }`}
                    >
                      {/* Left Accent Indicator */}
                      <div className={`absolute left-0 top-0 h-full w-[2px] rounded-full ${getStatusAccentClass(task.status)}`} />
                      
                      <div className="flex-1 space-y-1 pl-4">
                        <h3 className="text-sm font-medium text-slate-900">{task.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{task.serviceName}</p>
                        <p className="text-xs text-slate-400">Deadline: {task.deadline}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 pl-4 sm:pl-0">
                        <span className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-slate-700 rounded-xl px-3 py-1.5 text-xs shadow-[0_4px_15px_rgba(15,23,42,0.05)] hover:shadow-[0_6px_25px_rgba(15,23,42,0.08)] transition"
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                    <ClipboardList className="h-12 w-12 text-slate-400" />
                  </div>
                  <p className="mb-6 text-center text-sm text-slate-600">
                    Belum ada task. Buat task pertamamu sekarang.
                  </p>
                  <Button
                    className="bg-slate-900 text-white rounded-xl px-8 py-3 text-sm font-medium shadow-md hover:bg-slate-800 transition-all duration-300 ease-out"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Buat Task Baru
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Section Before Footer: WhatsApp Contact - Refined Premium Style */}
          <section>
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.2)]">
              <p className="text-center text-sm text-slate-200">
                Butuh bantuan? Hubungi Concierge Asistenku
              </p>
              <a
                href="https://wa.me/628817743613"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white/90 backdrop-blur text-slate-900 rounded-xl px-5 py-2 text-sm font-medium hover:bg-white transition">
                  Hubungi via WhatsApp
                </Button>
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Modal for Task Creation */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[500px] rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Buat Permintaan Baru</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Pilih Layanan */}
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm text-slate-600">Pilih Layanan</Label>
              <Select>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Pilih layanan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website Development</SelectItem>
                  <SelectItem value="social">Social Media Management</SelectItem>
                  <SelectItem value="admin">Admin Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Judul Task */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-slate-600">Judul Task</Label>
              <Input
                id="title"
                placeholder="Masukkan judul task..."
              />
            </div>

            {/* Detail Task */}
            <div className="space-y-2">
              <Label htmlFor="detail" className="text-sm text-slate-600">Detail Task</Label>
              <Textarea
                id="detail"
                placeholder="Jelaskan detail task..."
                rows={4}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm text-slate-600">Deadline</Label>
              <Input
                id="deadline"
                type="date"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-slate-900 text-white rounded-xl py-6 text-sm font-medium shadow-md hover:bg-slate-800 transition-all duration-300 ease-out"
              onClick={() => setIsModalOpen(false)}
            >
              Buat Permintaan ke Asistenmu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
