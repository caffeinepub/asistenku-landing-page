import { useNavigate } from '@tanstack/react-router';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <img src="/assets/asistenku-icon.png" alt="Asistenku" className="h-8 opacity-60" />
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Asistenku. Semua hak dilindungi.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 transition-colors"
          >
            Concierge WhatsApp
          </a>
          <button
            onClick={() => navigate({ to: '/internal' })}
            className="hover:text-teal-600 transition-colors"
          >
            Login Internal
          </button>
          <button
            onClick={() => navigate({ to: '/partner-portal' })}
            className="hover:text-teal-600 transition-colors"
          >
            Partner Portal
          </button>
        </nav>
      </div>
    </footer>
  );
}
