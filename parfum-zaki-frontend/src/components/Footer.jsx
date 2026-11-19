import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#FFFDF9] mt-auto">
      {/* Upper Features Bar */}
      <div className="border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C5A880] shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FFFDF9]">100% Authentique</h4>
                <p className="text-[11px] text-[#888888] mt-1">Parfums de niche et de créateur garantis originaux.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C5A880] shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FFFDF9]">Livraison Express</h4>
                <p className="text-[11px] text-[#888888] mt-1">24 à 72 heures partout au Maroc avec suivi.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C5A880] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FFFDF9]">Paiement à la livraison</h4>
                <p className="text-[11px] text-[#888888] mt-1">Payez en espèces en toute sécurité à réception.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C5A880] shrink-0">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#FFFDF9]">Échange Facile</h4>
                <p className="text-[11px] text-[#888888] mt-1">Service après-vente réactif sous 48h.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-playfair text-3xl font-bold tracking-tight text-[#FFFDF9]">
              PARFUM <span className="text-[#C5A880] italic">ZAKI</span>
            </span>
            <p className="text-[#999999] text-xs leading-relaxed max-w-sm">
              Votre destination de confiance au Maroc pour explorer les plus grandes créations olfactives.
              Testez avant d'adopter grâce à nos décantes 10ML prélevées directement des flacons originaux.
            </p>
            <div className="pt-2 text-xs text-[#C5A880] flex items-center gap-2">
              <Award size={16} />
              <span>Garantie Authenticité & Qualité Supérieure</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">Navigation</h5>
            <ul className="space-y-2 text-xs text-[#999999]">
              <li>
                <Link to="/" className="hover:text-[#FFFDF9] transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#FFFDF9] transition-colors">Toute la Boutique</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FFFDF9] transition-colors">Mon Panier</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#FFFDF9] transition-colors">Espace Gestionnaire (Admin)</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">Service Client & Commandes</h5>
            <div className="space-y-2.5 text-xs text-[#999999]">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#C5A880]" />
                <span>+212 600 000 000 (WhatsApp disponible)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#C5A880]" />
                <span>contact@parfumzaki.ma</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[#C5A880]" />
                <span>Casablanca, Maroc (Livraison nationale)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
          <p>© {new Date().getFullYear()} Parfum Zaki. Tous droits réservés.</p>
          <p className="tracking-wider uppercase text-[10px]">Testez avant d'adopter • 100% Original</p>
        </div>
      </div>
    </footer>
  );
}
