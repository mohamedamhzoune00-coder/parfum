import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const startingPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-cream-dark hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream-dark overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/600x600/f5f0e8/c8a96e?text=Parfum'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <p className="text-xs text-gris uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="font-playfair text-lg font-semibold text-noir mb-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-gold font-bold text-lg">
            {startingPrice} <span className="text-sm font-normal">DH</span>
          </p>
          {product.variants?.length > 1 && (
            <span className="text-xs text-gris-light">
              {product.variants.length} tailles
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
