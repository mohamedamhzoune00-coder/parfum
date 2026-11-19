import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-cream-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-noir hover:text-gold transition-colors"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-playfair text-xl md:text-2xl font-bold text-noir tracking-wide">
              PARFUM <span className="text-gold">ZAKI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gris hover:text-gold transition-colors uppercase tracking-wider"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-gris hover:text-gold transition-colors uppercase tracking-wider"
            >
              Boutique
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-gris hover:text-gold transition-colors"
              title="Admin"
            >
              <User size={20} />
            </Link>
            <Link to="/cart" className="relative text-noir hover:text-gold transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-cream-dark px-4 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm uppercase tracking-wider text-noir hover:text-gold transition-colors border-b border-cream-dark"
          >
            Accueil
          </Link>
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm uppercase tracking-wider text-noir hover:text-gold transition-colors"
          >
            Boutique
          </Link>
        </div>
      )}
    </nav>
  );
}
