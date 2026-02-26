import { smoothScrollTo } from '../utils/smoothScroll';

export default function Hero() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 leading-tight">
            <span className="block">Kerja tetap berjalan.</span>
            <span className="block text-teal-600">Hidup tetap tenang.</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Asistenku hadir sebagai mitra kerja profesional yang membantu Anda menyelesaikan
            pekerjaan administratif, riset, dan tugas harian — sehingga Anda bisa fokus pada
            hal yang benar-benar penting.
          </p>
          <p className="text-gray-500 text-base leading-relaxed">
            Dengan sistem berbasis unit layanan, Anda hanya membayar untuk pekerjaan yang
            benar-benar selesai.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => smoothScrollTo('layanan')}
              className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors"
            >
              Pilih Layanan
            </button>
            <a
              href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20ngobrol%20dulu%20tentang%20layanan%20Asistenku"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-teal-600 text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors"
            >
              Ngobrol dulu
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src="/assets/heroimagenew.png"
            alt="Asistenku Hero"
            className="w-full max-w-md rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
