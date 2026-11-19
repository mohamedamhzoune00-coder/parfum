import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  if (!product) return null;

  // Determine starting price from variants
  const startingPrice =
    product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : 0;

  // Fallback image if not provided
  const imageSrc =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group bg-white rounded-xl border border-[#F4EFEA] overflow-hidden flex flex-col hover:border-[#C5A880]/50 hover:shadow-xl hover:shadow-[#C5A880]/10 transition-all duration-300">
      {/* Image container */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/5] bg-[#F9F6F0] overflow-hidden block">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-[#111111] text-[#E7DAC7] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-md">
              <Sparkles size={11} className="text-[#C5A880]" />
              Best Seller
            </span>
          )}
        </div>

        {/* Available sizes pills */}
        {product.variants && product.variants.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {product.variants.map((variant, index) => (
              <span
                key={index}
                className="bg-white/90 backdrop-blur-xs text-[#111111] text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 rounded shadow-xs"
              >
                {variant.ml} ML
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#888888] font-medium block mb-1">
            {product.brand || 'Parfum de Luxe'}
          </span>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-playfair text-lg font-bold text-[#111111] group-hover:text-[#A38458] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#666666] line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-4 mt-4 border-t border-[#F4EFEA] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#888888] block">À partir de</span>
            <span className="text-base font-bold text-[#111111]">
              {startingPrice}{' '}
              <span className="text-xs font-semibold text-[#A38458]">DH</span>
            </span>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#111111] group-hover:text-[#C5A880] transition-colors"
          >
            <span>Choisir</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
