export default function TentangPartner() {
  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-navy-900 mb-3">Partner Asistenku</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Bergabunglah dengan jaringan profesional kami dan kerjakan task sesuai keahlian Anda.
          </p>
        </div>

        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Siapa Partner Asistenku?</h2>
          <p className="text-gray-600 leading-relaxed">
            Partner Asistenku adalah profesional independen yang bekerja secara fleksibel untuk
            menyelesaikan task dari klien kami. Mulai dari asisten virtual, peneliti, penulis
            konten, hingga spesialis administrasi — semua bisa bergabung.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Keuntungan Menjadi Partner</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Kerja fleksibel dari mana saja, kapan saja</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Penghasilan tambahan sesuai kapasitas Anda</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Task yang sesuai dengan keahlian dan minat Anda</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Dukungan penuh dari tim internal Asistenku</span>
            </li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Cara Bergabung</h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0 text-sm">1</span>
              <span>Daftarkan diri Anda melalui Portal Partner kami</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0 text-sm">2</span>
              <span>Tim kami akan memverifikasi profil dan keahlian Anda</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-teal-100 text-teal-700 font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0 text-sm">3</span>
              <span>Setelah disetujui, Anda bisa mulai menerima dan mengerjakan task</span>
            </li>
          </ol>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Sistem Pembayaran</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Partner dibayar berdasarkan unit layanan yang berhasil diselesaikan. Pembayaran
            dilakukan secara berkala melalui transfer bank setelah task diverifikasi selesai
            oleh klien.
          </p>
          <p className="text-gray-500 text-sm">
            Persentase bagi hasil ditentukan berdasarkan kesepakatan awal dan jenis layanan.
          </p>
        </div>

        {/* Card 5 - CTA */}
        <div className="bg-teal-600 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Siap Bergabung?</h2>
          <p className="text-teal-100 mb-6">
            Daftarkan diri Anda sekarang dan mulai perjalanan sebagai Partner Asistenku.
          </p>
          <a
            href="/partner-portal"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </main>
  );
}
