import { useNavigate } from '@tanstack/react-router';

export default function JoinTeam() {
  const navigate = useNavigate();

  return (
    <section className="bg-navy-900 py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Bergabung sebagai Partner Asistenku
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          Jadilah bagian dari jaringan profesional kami. Kerjakan task sesuai keahlian Anda,
          dapatkan penghasilan tambahan yang fleksibel.
        </p>
        <button
          onClick={() => navigate({ to: '/tentang-partner' })}
          className="bg-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-400 transition-colors text-lg"
        >
          Pelajari
        </button>
      </div>
    </section>
  );
}
