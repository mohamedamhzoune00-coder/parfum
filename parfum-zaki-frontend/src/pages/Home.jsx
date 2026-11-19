import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../api/products';
import { Star, ArrowRight, Package, Sparkles, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 8 });
        // res.data contains array of products
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products for home:', err);
        setError('Impossible de charger les parfums. Vérifiez que le serveur backend est en marche.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Ribbon Banner */}
      <section className="bg-[#111111] text-[#FFFDF9] py-4 border-y border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-around gap-4 text-xs uppercase tracking-widest font-medium">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A880] flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#C5A880" strokeWidth={0} />
              ))}
            </span>
            <span className="font-semibold text-[#FFFDF9]">Clients Satisfaits</span>
          </div>

          <div className="hidden sm:block text-[#444444]">•</div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#C5A880]" />
            <span>Paiement à la livraison</span>
          </div>

          <div className="hidden md:block text-[#444444]">•</div>

          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#C5A880]" />
            <span>Livraison 24-72h au Maroc</span>
          </div>

          <div className="hidden lg:block text-[#444444]">•</div>

          <div className="hidden lg:flex items-center gap-2">
            <Sparkles size={16} className="text-[#C5A880]" />
            <span>100% Jus Originaux</span>
          </div>
        </div>
      </section>

      {/* 3. Section: Choisissez votre collection */}
      <section id="collection" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#A38458] font-semibold block mb-2">
              Haute Parfumerie
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#111111]">
              Choisissez votre collection
            </h2>
            <p className="text-sm text-[#666666] mt-2 max-w-lg">
              Explorez nos flacons originaux et nos formats décantes 10ML pour essayer les créations les plus recherchées au monde.
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#111111] hover:text-[#C5A880] transition-colors pb-1 border-b border-[#111111] hover:border-[#C5A880] self-start md:self-auto"
          >
            <span>Voir toute la boutique</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Chargement des parfums exclusifs..." />
        ) : error ? (
          <div className="bg-[#FFFDF9] border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center max-w-lg mx-auto">
            <p className="text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-[#F9F6F0] rounded-2xl">
            <p className="text-sm text-[#777777]">Aucun parfum disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Section: Comment ça marche (3 étapes) */}
      <section id="comment-ca-marche" className="bg-[#F9F6F0] py-20 border-y border-[#E7DAC7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#A38458] font-semibold block mb-2">
              Processus Simple & Transparent
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#111111]">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-[#666666] mt-3">
              Découvrez la meilleure façon de tester vos parfums préférés sans vous ruiner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F4EFEA] shadow-xs relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-[#E7DAC7] font-playfair text-xl font-bold flex items-center justify-center mb-6 shadow-md">
                1
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#111111] mb-2">
                Choisissez
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Sélectionnez vos parfums coup de cœur au format décante 10ML ou en grand flacon original.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F4EFEA] shadow-xs relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#C5A880] text-white font-playfair text-xl font-bold flex items-center justify-center mb-6 shadow-md">
                2
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#111111] mb-2">
                Testez
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Recevez votre colis à domicile sous 24-72h et payez à la livraison en toute sécurité. Testez le sillage sur votre peau.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F4EFEA] shadow-xs relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-[#E7DAC7] font-playfair text-xl font-bold flex items-center justify-center mb-6 shadow-md">
                3
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#111111] mb-2">
                Adoptez
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Vous avez trouvé votre signature ? Commandez le flacon grand format 100ML en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Nos engagements */}
      <section id="engagements" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#A38458] font-semibold block mb-2">
            La Garantie Parfum Zaki
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#111111]">
            Nos 4 Engagements Majeurs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#F4EFEA] hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEA] flex items-center justify-center text-[#A38458] mb-4">
              <Truck size={24} />
            </div>
            <h4 className="font-playfair text-base font-bold text-[#111111] mb-1">Expédition Rapide</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Livraison partout au Maroc sous 24 à 72 heures. Livraison offerte dès 500 DH d'achats.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#F4EFEA] hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEA] flex items-center justify-center text-[#A38458] mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-playfair text-base font-bold text-[#111111] mb-1">Authenticité 100%</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Chaque décante est prélevée à la seringue stérile directement à partir des flacons originaux scellés.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#F4EFEA] hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEA] flex items-center justify-center text-[#A38458] mb-4">
              <Package size={24} />
            </div>
            <h4 className="font-playfair text-base font-bold text-[#111111] mb-1">Paiement à la Réception</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Réglez votre commande en espèces au livreur après avoir reçu et vérifié votre colis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#F4EFEA] hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEA] flex items-center justify-center text-[#A38458] mb-4">
              <HeartHandshake size={24} />
            </div>
            <h4 className="font-playfair text-base font-bold text-[#111111] mb-1">Service & Échange</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Une question ou une hésitation ? Notre équipe WhatsApp vous répond 7j/7 avec un échange garanti sous 48h.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
