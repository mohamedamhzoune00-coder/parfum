import { Star } from 'lucide-react';

export default function TrustBanner() {
  return (
    <div className="bg-gold text-white py-3 overflow-hidden">
      <div className="flex items-center justify-center gap-6 animate-pulse">
        <span className="text-sm font-medium uppercase tracking-wider flex items-center gap-1">
          Clients satisfaits
          <span className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="white" strokeWidth={0} />
            ))}
          </span>
        </span>
        <span className="text-white/60">|</span>
        <span className="text-sm font-medium uppercase tracking-wider">
          Payé à la livraison
        </span>
        <span className="text-white/60 hidden sm:inline">|</span>
        <span className="text-sm font-medium uppercase tracking-wider hidden sm:inline">
          Livraison 24-72h
        </span>
      </div>
    </div>
  );
}
