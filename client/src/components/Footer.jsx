import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-noir text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">
              PARFUM <span className="text-gold">ZAKI</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Des parfums de luxe 100% originaux au Maroc. 
              Testez avant d'adopter avec nos décantes de 10ML.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gold">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gold">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} />
                <span>+212 6XX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} />
                <span>contact@parfumzaki.ma</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} />
                <span>Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Parfum Zaki. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
