import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();

  const shippingCost = totalAmount >= 500 || totalAmount === 0 ? 0 : 30;
  const finalTotal = totalAmount + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C5A880]">
          <ShoppingBag size={36} strokeWidth={1.5} />
        </div>
        <h2 className="font-playfair text-3xl font-bold text-[#111111] mb-2">
          Votre Panier est Vide
        </h2>
        <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto mb-8">
          Vous n'avez pas encore sélectionné de parfums. Explorez notre catalogue pour découvrir nos formats décantes et flacons originaux.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-md"
        >
          <span>Découvrir la Boutique</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A38458] font-semibold block mb-1">
            Récapitulatif
          </span>
          <h1 className="font-playfair text-3xl font-bold text-[#111111]">
            Mon Panier ({cartItems.length})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#888888] hover:text-red-600 transition-colors underline"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.key}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F4EFEA] flex flex-col sm:flex-row items-center gap-4 shadow-xs"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-24 bg-[#F9F6F0] rounded-xl overflow-hidden shrink-0">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#888888] font-bold block">
                  {item.brand}
                </span>
                <Link to={`/product/${item.productId}`}>
                  <h3 className="font-playfair text-base font-bold text-[#111111] hover:text-[#C5A880] transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="inline-block bg-[#F9F6F0] text-[#A38458] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mt-1">
                  Format : {item.variant.ml} ML
                </div>
                <div className="text-xs text-[#555555] mt-1 font-sans">
                  Prix unitaire : <span className="font-semibold text-[#111111]">{item.variant.price} DH</span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-[#E7DAC7] rounded-full bg-white">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#111111] hover:text-[#C5A880]"
                  aria-label="Diminuer"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-xs font-bold font-sans text-[#111111]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#111111] hover:text-[#C5A880]"
                  aria-label="Augmenter"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-28 gap-2">
                <div className="font-bold text-sm text-[#111111]">
                  {item.subtotal}{' '}
                  <span className="text-xs font-semibold text-[#A38458]">DH</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.key)}
                  className="text-[#999999] hover:text-red-500 transition-colors p-1"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Quick Notice */}
          <div className="bg-[#F9F6F0] border border-[#E7DAC7]/60 rounded-xl p-4 flex items-center gap-3 text-xs text-[#666666]">
            <Truck size={18} className="text-[#C5A880] shrink-0" />
            <span>
              {totalAmount >= 500
                ? 'Félicitations ! Vous bénéficiez de la livraison offerte.'
                : `Ajoutez encore ${500 - totalAmount} DH pour débloquer la livraison gratuite.`}
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F4EFEA] shadow-xs space-y-5 sticky top-28">
            <h3 className="font-playfair text-xl font-bold text-[#111111] pb-3 border-b border-[#F4EFEA]">
              Détails de la commande
            </h3>

            <div className="space-y-3 text-xs text-[#555555]">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-semibold text-[#111111]">{totalAmount} DH</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Frais de livraison (Maroc) :</span>
                {shippingCost === 0 ? (
                  <span className="text-[#A38458] font-bold uppercase tracking-wider text-[11px]">
                    Gratuite
                  </span>
                ) : (
                  <span className="font-semibold text-[#111111]">30 DH</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Mode de règlement :</span>
                <span className="text-[#111111] font-medium">À la livraison (Espèces)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F4EFEA] flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider font-bold text-[#111111]">
                Total à payer :
              </span>
              <span className="text-2xl font-extrabold text-[#111111]">
                {finalTotal}{' '}
                <span className="text-sm font-semibold text-[#A38458]">DH</span>
              </span>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#111111]/10"
            >
              <span>Valider la commande</span>
              <ArrowRight size={15} />
            </Link>

            <div className="pt-2 text-center text-[10px] text-[#888888] flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck size={13} className="text-[#C5A880]" />
              <span>Commande garantie 100% sans risque</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
