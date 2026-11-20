import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { ArrowLeft, Check, Sparkles, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        const prod = res.data;
        setProduct(prod);

        // Pre-select first variant
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Impossible de trouver ce parfum. Il a peut-être été déplacé.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Chargement des détails du parfum..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="font-playfair text-2xl font-bold text-[#111111] mb-3">Parfum non trouvé</h2>
        <p className="text-xs text-[#666666] mb-6">{error || 'Le parfum demandé est introuvable.'}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#111111] text-[#FFFDF9] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full hover:bg-[#C5A880] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Retour à la boutique</span>
        </Link>
      </div>
    );
  }

  const imageSrc =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Retour au catalogue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Product Visuals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] bg-gradient-to-b from-[#FAF8F5] to-[#F3EEE7] rounded-2xl overflow-hidden border border-[#F4EFEA] shadow-md flex items-center justify-center p-6 sm:p-8">
            {/* Ambient subtle glow based on the perfume image */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-125 pointer-events-none"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />

            {/* Real Perfume Bottle Image */}
            <img
              src={imageSrc}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain object-center drop-shadow-md hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-[#111111]/90 backdrop-blur-xs text-[#E7DAC7] text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-sm shadow-md">
                <Sparkles size={13} className="text-[#C5A880]" />
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Information & Purchase options */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#A38458] font-bold block mb-1">
              {product.brand}
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Current Dynamic Price */}
          <div className="flex items-baseline gap-3 py-2 border-b border-[#F4EFEA]">
            <span className="font-sans text-3xl font-extrabold text-[#111111]">
              {selectedVariant ? selectedVariant.price : 0}
            </span>
            <span className="text-base font-bold text-[#A38458]">DH</span>
            <span className="text-xs text-[#888888] uppercase tracking-wider ml-2">
              (TTC • Paiement à la livraison)
            </span>
          </div>

          {/* Perfume Description */}
          <div className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Variant Selector (ML Formats) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111]">
                  Choisir le format (ML) :
                </label>
                <span className="text-[11px] text-[#A38458] font-medium">
                  {selectedVariant?.stock > 0 ? 'En stock disponible' : 'Rupture temporaire'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?._id === v._id;
                  return (
                    <button
                      key={v._id || v.ml}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#FFFDF9] ring-2 ring-[#C5A880]/30 shadow-xs'
                          : 'border-[#E7DAC7] bg-white hover:border-[#C5A880]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                          {v.ml} ML
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#C5A880] text-white flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#A38458] mt-2">
                        {v.price} DH
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#888888] mt-0.5">
                        {v.ml <= 15 ? 'Format Décante' : 'Flacon Original'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="pt-2 flex items-center gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#111111]">
              Quantité :
            </span>
            <div className="inline-flex items-center border border-[#E7DAC7] rounded-full bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-[#111111] hover:text-[#C5A880] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-9 text-center text-xs font-bold text-[#111111] font-sans">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-[#111111] hover:text-[#C5A880] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-[#F9F6F0] text-[#111111] border-2 border-[#111111] py-4 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ShoppingBag size={16} />
                <span>Ajouter au panier</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-[#111111] hover:bg-[#C5A880] text-white py-4 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#111111]/15 hover:shadow-xl"
              >
                <span>Commander maintenant</span>
              </button>
            </div>

            {/* Notification when added */}
            {addedMessage && (
              <div className="bg-[#E7DAC7]/30 border border-[#C5A880] text-[#111111] px-4 py-3 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
                <span className="font-medium">
                  ✓ Parfum ajouté avec succès au panier ({selectedVariant?.ml} ML) !
                </span>
                <Link to="/cart" className="underline font-bold text-[#A38458] ml-2">
                  Voir le panier
                </Link>
              </div>
            )}
          </div>

          {/* Service Guarantee Badges */}
          <div className="pt-6 border-t border-[#F4EFEA] grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-[#F9F6F0]">
              <Truck size={18} className="text-[#C5A880] mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-[#111111] block">24 - 72H</span>
              <span className="text-[9px] text-[#777777] block">Livraison Express</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F9F6F0]">
              <ShieldCheck size={18} className="text-[#C5A880] mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-[#111111] block">À la Réception</span>
              <span className="text-[9px] text-[#777777] block">Paiement en espèces</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F9F6F0]">
              <RotateCcw size={18} className="text-[#C5A880] mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-[#111111] block">100% Original</span>
              <span className="text-[9px] text-[#777777] block">Garantie certifiée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
