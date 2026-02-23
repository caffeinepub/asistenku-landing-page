import { Button } from './ui/button';
import { smoothScrollTo } from '../utils/smoothScroll';

export default function Hero() {
  const handlePilihLayanan = () => {
    smoothScrollTo('service-cards');
  };

  return (
    <section className="container px-4 py-12 md:px-6 md:py-20 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="font-bold tracking-tight text-navy">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Kerja tetap berjalan.
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Hidup tetap tenang.
            </span>
          </h1>
          
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Asistenku adalah sistem pendampingan dalam pengaturan delegasi tugas.
            </p>
            <p>
              Kami menjaga setiap layanan agar tetap berjalan dengan kualitas terbaik.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={handlePilihLayanan}
              className="bg-teal text-white hover:bg-teal/90"
            >
              Pilih Layanan
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <a
                href="https://wa.me/628817743613"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ngobrol dulu
              </a>
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex items-center justify-center">
          <img
            src="/assets/heroimagenew.png"
            alt="Asistenku Hero"
            className="w-full max-w-lg rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
