import { Link } from '@tanstack/react-router';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img
            src="/assets/asistenku-icon.png"
            alt="Asistenku"
            className="h-12 w-auto"
          />

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            Asistenku © {new Date().getFullYear()} PT Asistenku Digital Indonesia
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="https://wa.me/628817743613"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Hubungi Concierge (WhatsApp)
            </a>
            <span className="text-muted-foreground/40">•</span>
            <Link
              to="/internal-portal"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Login Internal
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              to="/partner-portal"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Partner Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
