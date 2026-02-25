import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMasuk = () => {
    navigate({ to: '/client-login' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/asistenku-horizontal.png"
            alt="Asistenku"
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/#layanan"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Layanan
          </a>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/client-register">Daftar</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMasuk}
          >
            Masuk
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container flex flex-col gap-4 px-4 py-4">
            <a
              href="/#layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Layanan
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/client-register">Daftar</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => {
                setMobileMenuOpen(false);
                handleMasuk();
              }}
            >
              Masuk
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
