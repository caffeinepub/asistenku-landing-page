import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export default function JoinTeam() {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-navy md:text-4xl">
            Ingin jadi bagian dari Tim Asistenku?
          </h2>
          <Button variant="outline" size="lg" asChild>
            <Link to="/tentang-partner-asistenku">Pelajari</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
