import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function TentangPartner() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto max-w-[1150px] px-4 py-12 md:px-6 md:py-16">
        <div className="space-y-12">
          {/* 1. Hero / Intro Section */}
          <section className="rounded-xl bg-white p-8 text-center shadow-md md:p-12">
            <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Tentang Partner Asistenku
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Partner Asistenku adalah profesional yang membantu menjalankan tugas klien dengan efektif, terstruktur, dan terpercaya.
            </p>
          </section>

          {/* 2. Bagaimana Partner Asistenku Bekerja */}
          <section className="rounded-xl bg-white p-8 shadow-md md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
              Bagaimana Partner Asistenku Bekerja
            </h2>
            <ol className="ml-5 list-decimal space-y-3 text-slate-600 md:text-lg">
              <li>Partner menerima briefing dari Asistenmu</li>
              <li>Mengatur dan menjalankan tugas sesuai struktur kerja</li>
              <li>Hasil dicek & divalidasi oleh Asistenmu sebelum sampai ke client</li>
              <li>Feedback diterima dan digunakan untuk optimasi berikutnya</li>
            </ol>
          </section>

          {/* 3. Level & Verifikasi */}
          <section className="rounded-xl bg-white p-8 shadow-md md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
              Level & Verifikasi
            </h2>
            <ul className="ml-5 list-disc space-y-3 text-slate-600 md:text-lg">
              <li>Partner bisa naik level sesuai skill dan pengalaman</li>
              <li>Verifikasi skill dilakukan secara berkala</li>
              <li>Jam kerja efektif dikurasi & dimonitor oleh sistem</li>
            </ul>
          </section>

          {/* 4. Sistem Kerja Transparan & Terstandarisasi */}
          <section className="rounded-xl bg-white p-8 shadow-md md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
              Sistem Kerja Transparan & Terstandarisasi
            </h2>
            <ul className="ml-5 list-disc space-y-3 text-slate-600 md:text-lg">
              <li>Bukan marketplace dan bukan sistem freelance biasa</li>
              <li>Semua partner bekerja sesuai sistem internal Asistenku</li>
              <li>Standar gaji menggunakan UMR Indonesia sebagai baseline</li>
              <li>Jam kerja efektif tiap pekerjaan berbeda-beda sesuai scope kerja</li>
              <li>Struktur kerja dan alokasi tugas terukur & terkurasi oleh Asistenmu</li>
            </ul>
          </section>

          {/* 5. Level, Jam Efektif & Penempatan Partner */}
          <section className="rounded-xl bg-white p-8 shadow-md md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">
              Level, Jam Efektif & Penempatan Partner
            </h2>
            <ul className="ml-5 list-disc space-y-3 text-slate-600 md:text-lg">
              <li>Standar gaji mengikuti UMR Jakarta, dikonversi ke jam efektif tiap pekerjaan sesuai undang-undang ketenagakerjaan</li>
              <li>Tersedia 3 level: Junior, Senior, Expert</li>
              <li>Penempatan disesuaikan dengan skill terverifikasi, pengalaman, dan tes penempatan level</li>
              <li>Akademik / pendidikan formal tidak menjadi prioritas utama</li>
              <li>Usia tidak menjadi batasan untuk aktivasi dan penempatan</li>
              <li>Verifikasi melalui skill test, sertifikasi, dan penilaian praktis</li>
              <li>Aktivasi partner berdasarkan kebutuhan & perkembangan klien, bukan bidding atau rebutan pekerjaan</li>
              <li>Struktur kerja terukur, terkurasi, dan sesuai sistem internal Asistenku</li>
            </ul>
            
            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-black px-8 py-6 text-base font-semibold text-white hover:bg-black/90 md:text-lg"
              >
                <Link to="/partner-portal">Daftar Sekarang</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
