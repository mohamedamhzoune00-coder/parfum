import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-noir via-noir-light to-noir overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles size={16} />
            <span>100% Originaux</span>
          </div>

          {/* Title */}
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Testez avant
            <br />
            <span className="text-gold italic">d'adopter.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Des parfums de luxe en 10ML, 100% originaux,
            <br className="hidden md:block" />
            payés à la livraison.
          </p>

          {/* CTA */}
          <Link
            to="/products"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-full text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5"
          >
            Voir la collection
          </Link>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-16 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl mb-3">🧴</div>
            <h3 className="font-playfair text-white font-semibold text-lg mb-2">FLACON 100ML</h3>
            <p className="text-gray-400 text-sm">Original — Full Size</p>
          </div>
          <div className="bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-2xl p-6 text-center hover:bg-gold/30 transition-all duration-300">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-playfair text-white font-semibold text-lg mb-2">DÉCANTE 10ML</h3>
            <p className="text-gold-light text-sm">Testez avant d'adopter</p>
          </div>
        </div>
      </div>
    </section>
  );
}
