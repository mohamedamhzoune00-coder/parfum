import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Casablanca',
    address: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const shippingCost = totalAmount >= 500 || totalAmount === 0 ? 0 : 30;
  const finalTotal = totalAmount + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Prepare order items in schema format
      const formattedItems = cartItems.map((item) => ({
        product: item.productId,
        productName: `${item.name} (${item.variant.ml} ML)`,
        variant: {
          ml: item.variant.ml,
          price: item.variant.price,
        },
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));

      const payload = {
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
        },
        items: formattedItems,
        total: finalTotal,
        paymentMethod: 'cod',
        notes: formData.notes ? formData.notes.trim() : undefined,
      };

      const res = await createOrder(payload);
      if (res.success && res.data) {
        setOrderSuccess(res.data);
        clearCart();
      } else {
        setError(res.message || 'Une erreur est survenue lors de la création de la commande.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(
        err.response?.data?.message ||
          'Erreur de communication avec le serveur. Veuillez vérifier vos coordonnées.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#F4EFEA] text-[#A38458] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 size={44} />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#A38458] font-bold block mb-1">
          Commande Enregistrée avec Succès !
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#111111] mb-2">
          Merci pour votre confiance
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mb-8">
          Votre commande a été transmise à notre atelier. Nous vous contacterons par téléphone ou WhatsApp pour confirmer l'expédition.
        </p>

        {/* Order Details Card */}
        <div className="bg-white border border-[#E7DAC7] p-6 rounded-2xl text-left max-w-lg mx-auto shadow-xs mb-8 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#F4EFEA]">
            <span className="text-xs uppercase tracking-wider text-[#888888]">Numéro de commande :</span>
            <span className="font-mono text-sm font-bold text-[#111111] bg-[#F9F6F0] px-3 py-1 rounded">
              {orderSuccess.orderNumber || 'PZ-CONFIRMÉ'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#666666]">Destinataire :</span>
            <span className="font-semibold text-[#111111]">{orderSuccess.customer?.fullName}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#666666]">Téléphone :</span>
            <span className="font-semibold text-[#111111]">{orderSuccess.customer?.phone}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#666666]">Ville de livraison :</span>
            <span className="font-semibold text-[#111111]">{orderSuccess.customer?.city}</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-[#F4EFEA]">
            <span className="font-bold text-[#111111]">Montant à payer au livreur :</span>
            <span className="text-base font-extrabold text-[#A38458]">
              {orderSuccess.total} DH
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full transition-all"
        >
          <span>Retour à l'Accueil</span>
        </Link>
      </div>
    );
  }

  // EMPTY CART REDIRECT
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="font-playfair text-2xl font-bold text-[#111111] mb-2">Aucun article à commander</h2>
        <p className="text-xs text-[#666666] mb-6">Ajoutez d'abord des parfums à votre panier avant de commander.</p>
        <Link
          to="/shop"
          className="bg-[#111111] text-[#FFFDF9] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full hover:bg-[#C5A880] transition-colors"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Modifier le panier</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#F4EFEA] shadow-xs">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-[#A38458] font-bold block mb-1">
              Informations de Livraison
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#111111]">
              Paiement à la Livraison
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              Remplissez le formulaire ci-dessous. Aucun paiement par carte n'est requis aujourd'hui.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Ex: Mohammed Alami"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                Numéro de téléphone / WhatsApp *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Ex: 06 12 34 56 78"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              />
              <span className="text-[10px] text-[#888888] mt-1 block">
                Le livreur vous contactera sur ce numéro avant son passage.
              </span>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                Ville *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
                <option value="Fès">Fès</option>
                <option value="Agadir">Agadir</option>
                <option value="Meknès">Meknès</option>
                <option value="Oujda">Oujda</option>
                <option value="Kénitra">Kénitra</option>
                <option value="Tétouan">Tétouan</option>
                <option value="Mohammédia">Mohammédia</option>
                <option value="Autre ville">Autre ville au Maroc</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                Adresse exacte de livraison *
              </label>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="Quartier, Rue, Résidence, N° d'appartement..."
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              ></textarea>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
                Instructions spéciales (Optionnel)
              </label>
              <input
                type="text"
                name="notes"
                placeholder="Ex: Livrer de préférence l'après-midi..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#111111]/15 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <span>Confirmation en cours...</span>
                ) : (
                  <span>Confirmer la Commande ({finalTotal} DH)</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#F4EFEA] shadow-xs space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#111111] pb-3 border-b border-[#F4EFEA]">
            Articles commandés ({cartItems.length})
          </h3>

          <div className="divide-y divide-[#F9F6F0] max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.key} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-[#F9F6F0] rounded-lg overflow-hidden shrink-0">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111111] line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-[#888888] uppercase">
                      {item.variant.ml} ML × {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-[#111111] shrink-0">{item.subtotal} DH</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F4EFEA] space-y-2 text-xs text-[#666666]">
            <div className="flex justify-between">
              <span>Sous-total :</span>
              <span className="font-semibold text-[#111111]">{totalAmount} DH</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison :</span>
              <span className="font-semibold text-[#111111]">
                {shippingCost === 0 ? 'Gratuite' : `${shippingCost} DH`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#F4EFEA] text-sm font-bold text-[#111111]">
              <span>Total à régler au livreur :</span>
              <span className="text-lg text-[#A38458]">{finalTotal} DH</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4EFEA] bg-[#F9F6F0] p-4 rounded-xl text-[11px] text-[#555555] space-y-2">
            <div className="flex items-center gap-2 text-[#111111] font-semibold">
              <ShieldCheck size={16} className="text-[#C5A880]" />
              <span>Paiement 100% sécurisé à réception</span>
            </div>
            <p className="text-[10px] text-[#777777] leading-relaxed">
              Vous ne payez que lorsque le livreur se présente à votre porte. Vérifiez votre colis en toute tranquillité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
