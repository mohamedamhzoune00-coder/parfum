import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F4EFEA] transition-all">
      {/* Top announcement bar */}
      <div className="bg-[#111111] text-[#E7DAC7] text-[11px] font-medium py-1.5 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles size={12} className="text-[#C5A880]" />
        <span>Livraison gratuite partout au Maroc dès 500 DH • Paiement à la livraison</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#C5A880] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] group-hover:text-[#A38458] transition-colors">
                PARFUM <span className="text-[#C5A880] italic">ZAKI</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#555555] -mt-1 font-sans">
                Haute Parfumerie & Décants
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                isActive('/') ? 'text-[#C5A880] font-semibold' : 'text-[#111111]'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                isActive('/shop') ? 'text-[#C5A880] font-semibold' : 'text-[#111111]'
              }`}
            >
              Boutique
            </Link>
            <a
              href="/#comment-ca-marche"
              className="text-xs uppercase tracking-widest font-medium text-[#111111] transition-colors hover:text-[#C5A880]"
            >
              Comment ça marche
            </a>
            <a
              href="/#engagements"
              className="text-xs uppercase tracking-widest font-medium text-[#111111] transition-colors hover:text-[#C5A880]"
            >
              Nos Engagements
            </a>
          </nav>

          {/* Action icons */}
          <div className="flex items-center space-x-5">
            <Link
              to="/admin/dashboard"
              className="p-2 text-[#555555] hover:text-[#C5A880] transition-colors"
              title="Espace Administration"
            >
              <ShieldCheck size={20} strokeWidth={1.5} />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-[#111111] hover:text-[#C5A880] transition-colors group"
              aria-label="Panier"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A880] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#F4EFEA] px-6 py-6 space-y-4 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest text-[#111111] hover:text-[#C5A880] py-2"
          >
            Accueil
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest text-[#111111] hover:text-[#C5A880] py-2"
          >
            Boutique & Collections
          </Link>
          <a
            href="/#comment-ca-marche"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest text-[#111111] hover:text-[#C5A880] py-2"
          >
            Comment ça marche
          </a>
          <a
            href="/#engagements"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase tracking-widest text-[#111111] hover:text-[#C5A880] py-2"
          >
            Nos Engagements
          </a>
          <div className="pt-4 border-t border-[#F4EFEA]">
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#555555] hover:text-[#C5A880]"
            >
              <ShieldCheck size={16} />
              <span>Accès Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
