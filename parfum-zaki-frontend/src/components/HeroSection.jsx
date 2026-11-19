import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF9] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#F4EFEA]">
      {/* Background soft ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E7DAC7]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFEA] border border-[#E7DAC7] text-[#A38458] text-[11px] font-semibold uppercase tracking-widest mb-6">
            <Sparkles size={13} className="text-[#C5A880]" />
            <span>Haute Parfumerie au Maroc</span>
          </div>

          {/* Main Headline (SF.Fragrances inspiration) */}
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] leading-[1.15] mb-6">
            Testez avant <br className="hidden sm:block" />
            <span className="text-[#C5A880] italic font-normal">d'adopter.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#555555] font-light max-w-xl mx-auto leading-relaxed mb-8">
            Des parfums de luxe en <strong className="font-semibold text-[#111111]">10 ML</strong>, 100% originaux, livrés chez vous et payés à la livraison.
          </p>

          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg shadow-[#111111]/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href="#comment-ca-marche"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F4EFEA] text-[#111111] border border-[#E7DAC7] px-7 py-4 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300"
            >
              <span>Comment ça marche ?</span>
            </a>
          </div>

          {/* Mini benefits guarantee */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-[#777777] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#C5A880]" /> 100% Originaux
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-[#C5A880]" /> Paiement à la réception
            </span>
          </div>
        </div>

        {/* Two Highlight Cards (Inspired directly by SF.Fragrances) */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Flacon Original */}
          <div className="bg-white border border-[#E7DAC7] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] border border-[#E7DAC7] flex items-center justify-center text-2xl shrink-0">
              🧴
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A38458] font-bold block">
                Format Grand Flacon
              </span>
              <h3 className="font-playfair text-lg font-bold text-[#111111] mt-0.5">
                FLACON 100ML
              </h3>
              <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                Le flacon original scellé dans sa boîte d'origine. Parfait pour vos signatures préférées.
              </p>
            </div>
          </div>

          {/* Card 2: Décante 10ML */}
          <div className="bg-[#111111] text-[#FFFDF9] border border-[#222222] p-6 rounded-2xl shadow-lg shadow-[#111111]/15 hover:shadow-xl transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] border border-[#333333] flex items-center justify-center text-2xl shrink-0">
              ✨
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold block">
                Format Découverte
              </span>
              <h3 className="font-playfair text-lg font-bold text-[#FFFDF9] mt-0.5">
                DÉCANTE 10ML
              </h3>
              <p className="text-xs text-[#AAAAAA] mt-1 leading-relaxed">
                Prélevé avec précision du flacon original. Environ 120 vaporisations pour tester sur plusieurs jours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
