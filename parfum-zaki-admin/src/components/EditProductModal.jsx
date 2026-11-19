import React, { useState, useEffect } from 'react';
import { updateProduct, getCategories } from '../api/products';
import { X, Plus, Trash2, Save, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    imagesText: '',
    isBestSeller: false,
    isActive: true,
  });

  const [variants, setVariants] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fetch categories & populate initial form data
  useEffect(() => {
    if (!product) return;

    // 1. Fetch categories
    getCategories()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching categories in modal:', err);
      });

    // 2. Populate form fields
    const catId =
      typeof product.category === 'object' && product.category !== null
        ? product.category._id
        : product.category || '';

    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: catId,
      description: product.description || '',
      imagesText: Array.isArray(product.images) ? product.images.join('\n') : '',
      isBestSeller: Boolean(product.isBestSeller),
      isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
    });

    // 3. Populate variants
    if (product.variants && product.variants.length > 0) {
      setVariants(
        product.variants.map((v) => ({
          _id: v._id,
          ml: v.ml,
          price: v.price,
          stock: v.stock !== undefined ? v.stock : 0,
        }))
      );
    } else {
      setVariants([{ ml: 10, price: 150, stock: 10 }]);
    }

    setError(null);
    setSuccessMsg(null);
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === 'ml' || field === 'price' || field === 'stock' ? Number(value) : value,
      };
      return copy;
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { ml: 50, price: 500, stock: 10 }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      alert('Il faut au moins un variant (format/taille) pour le parfum.');
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.brand.trim() || !formData.description.trim()) {
      setError('Veuillez remplir le nom, la marque et la description.');
      return;
    }

    if (!formData.category) {
      setError('Veuillez sélectionner une catégorie.');
      return;
    }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.ml || v.ml <= 0) {
        setError(`Le format (ML) du variant #${i + 1} doit être supérieur à 0.`);
        return;
      }
      if (v.price === undefined || v.price < 0) {
        setError(`Le prix du variant #${i + 1} doit être positif ou nul.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);

      // Parse images from text (separated by newline or comma)
      const imagesList = formData.imagesText
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        description: formData.description.trim(),
        images: imagesList.length > 0 ? imagesList : product.images || [],
        isBestSeller: formData.isBestSeller,
        isActive: formData.isActive,
        variants: variants.map((v) => ({
          ml: Number(v.ml),
          price: Number(v.price),
          stock: Number(v.stock) || 0,
        })),
      };

      const res = await updateProduct(product._id, payload);

      if (res.success && res.data) {
        setSuccessMsg('Produit mis à jour avec succès !');
        if (onProductUpdated) {
          onProductUpdated(res.data);
        }
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError(res.message || 'Erreur lors de la mise à jour du produit.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la sauvegarde. Vérifiez les champs et réessayez.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFDF9] rounded-2xl border border-[#E7DAC7] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#111111] text-[#FFFDF9] px-6 py-5 flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-[#C5A880]">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-bold block">
                Gestion Catalogue
              </span>
              <h2 className="font-playfair text-lg font-bold text-[#FFFDF9]">
                Modifier le Parfum : <span className="text-[#C5A880]">{product.name}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#999999] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* General Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                  Nom du Parfum *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Bleu de Chanel"
                  className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                  Marque / Maison *
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ex: Chanel, Dior, Tom Ford..."
                  className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Category and Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                  Catégorie *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                >
                  <option value="">Sélectionner une catégorie...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880] cursor-pointer"
                />
                <label htmlFor="isBestSeller" className="text-xs font-semibold text-[#111111] cursor-pointer">
                  Mettre en "Best Seller" ⭐
                </label>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880] cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-[#111111] cursor-pointer">
                  Produit Actif (Visible)
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                Description olfactive & Notes *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Description des notes de tête, de cœur et de fond..."
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all leading-relaxed"
              ></textarea>
            </div>

            {/* Images URLs */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                Images du Produit (Liens URLs, une par ligne ou séparées par une virgule)
              </label>
              <textarea
                name="imagesText"
                rows={2}
                value={formData.imagesText}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#F9F6F0] text-xs font-mono text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              ></textarea>
            </div>

            {/* ================= VARIANTS (ML, PRICE, STOCK) ================= */}
            <div className="pt-2 border-t border-[#F4EFEA]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
                    Formats & Prix (Variants)
                  </h3>
                  <span className="text-[10px] text-[#777777]">
                    Définissez les différentes contenances en ML (ex: 10ml décante, 50ml, 100ml) avec leurs prix et stocks.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center gap-1.5 bg-[#F4EFEA] hover:bg-[#E7DAC7] text-[#111111] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Ajouter un format</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {variants.map((v, index) => (
                  <div
                    key={v._id || index}
                    className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white border border-[#E7DAC7] shadow-2xs"
                  >
                    {/* Contenance ML */}
                    <div className="flex-1 min-w-[100px]">
                      <label className="block text-[10px] uppercase font-bold text-[#888888] mb-0.5">
                        Contenance (ML)
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          required
                          value={v.ml}
                          onChange={(e) => handleVariantChange(index, 'ml', e.target.value)}
                          className="w-full bg-[#F9F6F0] text-xs font-bold text-[#111111] px-2.5 py-1.5 rounded-lg border border-transparent focus:border-[#C5A880] focus:bg-white"
                        />
                        <span className="text-xs font-bold text-[#888888]">ML</span>
                      </div>
                    </div>

                    {/* Prix en DH */}
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] uppercase font-bold text-[#888888] mb-0.5">
                        Prix de vente (DH)
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          required
                          value={v.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full bg-[#F9F6F0] text-xs font-bold text-[#A38458] px-2.5 py-1.5 rounded-lg border border-transparent focus:border-[#C5A880] focus:bg-white"
                        />
                        <span className="text-xs font-bold text-[#A38458]">DH</span>
                      </div>
                    </div>

                    {/* Quantité Stock */}
                    <div className="flex-1 min-w-[100px]">
                      <label className="block text-[10px] uppercase font-bold text-[#888888] mb-0.5">
                        Stock disponible
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={v.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-2.5 py-1.5 rounded-lg border border-transparent focus:border-[#C5A880] focus:bg-white"
                      />
                    </div>

                    {/* Delete variant */}
                    <div className="self-end pb-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="p-2 text-[#999999] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer ce format"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F9F6F0] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#E7DAC7]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#E7DAC7] text-xs uppercase tracking-wider font-semibold text-[#666666] hover:bg-white transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{submitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
