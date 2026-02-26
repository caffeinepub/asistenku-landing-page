import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLayananClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate({ to: '/' }).then(() => {
        setTimeout(() => smoothScrollTo('layanan'), 100);
      });
    } else {
      smoothScrollTo('layanan');
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img src="/assets/asistenku-horizontal.png" alt="Asistenku" className="h-8" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <button onClick={handleLayananClick} className="hover:text-teal-600 transition-colors">
            Layanan
          </button>
          <button
            onClick={() => navigate({ to: '/tentang-partner' })}
            className="hover:text-teal-600 transition-colors"
          >
            Jadi Partner
          </button>
          <button
            onClick={() => navigate({ to: '/client-register' })}
            className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-colors text-sm font-semibold"
          >
            Daftar
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">
          <button onClick={handleLayananClick} className="text-left hover:text-teal-600 transition-colors">
            Layanan
          </button>
          <button
            onClick={() => { navigate({ to: '/tentang-partner' }); setMenuOpen(false); }}
            className="text-left hover:text-teal-600 transition-colors"
          >
            Jadi Partner
          </button>
          <button
            onClick={() => { navigate({ to: '/client-register' }); setMenuOpen(false); }}
            className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-colors text-sm font-semibold text-center"
          >
            Daftar
          </button>
        </div>
      )}
    </header>
  );
}
