export default function HowWeSupport() {
  const steps = [
    {
      number: '01',
      title: 'Konsultasi Kebutuhan',
      description:
        'Kami memahami kebutuhan spesifik Anda melalui sesi konsultasi singkat untuk menentukan layanan yang paling tepat.',
    },
    {
      number: '02',
      title: 'Aktivasi Layanan',
      description:
        'Layanan diaktifkan dan unit kerja disiapkan sesuai paket yang dipilih. Anda langsung bisa mulai membuat task.',
    },
    {
      number: '03',
      title: 'Pengerjaan oleh Partner',
      description:
        'Task Anda dikerjakan oleh Partner Asistenku yang terverifikasi dan berpengalaman di bidangnya.',
    },
    {
      number: '04',
      title: 'Review & Selesai',
      description:
        'Anda mereview hasil kerja dan memberikan persetujuan. Task selesai, unit layanan terpakai.',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Bagaimana Asistenku Mendukung Anda
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Proses sederhana, hasil nyata. Kami hadir di setiap langkah perjalanan kerja Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-3">
              <span className="text-4xl font-bold text-teal-200">{step.number}</span>
              <h3 className="text-lg font-semibold text-navy-900">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-12 italic">
          Dari konsultasi hingga penyelesaian — kami ada untuk Anda.
        </p>
      </div>
    </section>
  );
}
