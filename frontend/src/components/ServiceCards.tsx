import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const services = [
  {
    id: 'tanya-jawab',
    emoji: '💬',
    title: 'Tanya Jawab',
    tagline: 'Konsultasi cepat untuk keputusan tepat',
    price: 'Rp 150.000 / unit',
    description:
      'Dapatkan jawaban atas pertanyaan bisnis, riset singkat, atau klarifikasi data dalam waktu cepat. Cocok untuk kebutuhan ad-hoc yang tidak memerlukan pengerjaan panjang.',
    includes: ['Riset singkat (max 2 jam)', 'Jawaban terstruktur', 'Sumber referensi'],
    whatsapp: 'https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Tanya%20Jawab',
  },
  {
    id: 'asisten-harian',
    emoji: '📋',
    title: 'Asisten Harian',
    tagline: 'Delegasikan tugas rutin Anda',
    price: 'Rp 300.000 / unit',
    description:
      'Serahkan tugas administratif, penjadwalan, pengelolaan email, dan pekerjaan harian lainnya kepada asisten profesional kami. Fokus pada hal yang lebih strategis.',
    includes: ['Manajemen jadwal', 'Pengelolaan email', 'Koordinasi meeting', 'Laporan harian'],
    whatsapp: 'https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Asisten%20Harian',
  },
  {
    id: 'riset-analisis',
    emoji: '🔍',
    title: 'Riset & Analisis',
    tagline: 'Data yang Anda butuhkan, siap pakai',
    price: 'Rp 500.000 / unit',
    description:
      'Riset mendalam tentang pasar, kompetitor, tren industri, atau topik spesifik yang Anda butuhkan. Disajikan dalam format yang mudah dipahami dan langsung bisa digunakan.',
    includes: ['Riset komprehensif', 'Analisis data', 'Laporan terstruktur', 'Rekomendasi actionable'],
    whatsapp: 'https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Riset%20%26%20Analisis',
  },
  {
    id: 'konten-kreatif',
    emoji: '✍️',
    title: 'Konten Kreatif',
    tagline: 'Konten berkualitas tanpa repot',
    price: 'Rp 400.000 / unit',
    description:
      'Dari artikel blog, caption media sosial, hingga materi presentasi — tim kreatif kami siap menghasilkan konten yang sesuai dengan brand voice dan tujuan bisnis Anda.',
    includes: ['Penulisan artikel/blog', 'Caption media sosial', 'Materi presentasi', 'Copywriting'],
    whatsapp: 'https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Konten%20Kreatif',
  },
];

export default function ServiceCards() {
  return (
    <section id="layanan" className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Layanan Kami</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Pilih layanan yang sesuai dengan kebutuhan Anda. Semua layanan berbasis unit —
            transparan dan terukur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={service.id} className="border-none">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4 text-left w-full">
                      <span className="text-3xl">{service.emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-navy-900">{service.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{service.tagline}</p>
                        <p className="text-sm font-semibold text-teal-600 mt-1">{service.price}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-1 mb-5">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-teal-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={service.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Mulai Sekarang
                    </a>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
