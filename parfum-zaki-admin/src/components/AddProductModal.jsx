import React, { useState, useEffect, useRef } from 'react';
import { createProduct, getCategories } from '../api/products';
import {
  X,
  Plus,
  Trash2,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    badge: 'none', // 'none' | 'best_seller' | 'new_arrival' | 'featured'
    isActive: true,
  });

  // Image State (File data URL or custom URL)
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'

  // Variants State
  const [variants, setVariants] = useState([
    { ml: 10, price: 150, stock: 25 },
    { ml: 100, price: 1100, stock: 10 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load categories on open
  useEffect(() => {
    if (!isOpen) return;

    getCategories()
      .then((res) => {
        const cats = res.data || [];
        setCategories(cats);
        if (cats.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: cats[0]._id }));
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });

    // Reset states
    setError(null);
    setSuccessMsg(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image sélectionnée est trop volumineuse (max 5 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    if (!imageUrlInput.trim()) return;
    setImagePreview(imageUrlInput.trim());
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Variant Handlers
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

  const handleAddVariant = (defaultMl = 50, defaultPrice = 550) => {
    setVariants((prev) => [
      ...prev,
      { ml: defaultMl, price: defaultPrice, stock: 15 },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      alert('Un parfum doit comporter au moins un format (variant).');
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.brand.trim() || !formData.description.trim()) {
      setError('Veuillez renseigner le nom, la marque et la description du parfum.');
      return;
    }

    if (!formData.category) {
      setError('Veuillez sélectionner une catégorie.');
      return;
    }

    if (variants.length === 0) {
      setError('Veuillez définir au moins un format de flacon pour ce parfum.');
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.ml || v.ml <= 0) {
        setError(`Le format (ML) du variant #${i + 1} doit être supérieur à 0.`);
        return;
      }
      if (v.price === undefined || v.price < 0) {
        setError(`Le prix du variant #${i + 1} doit être un nombre positif.`);
        return;
      }
      if (v.stock === undefined || v.stock < 0) {
        setError(`La quantité en stock du variant #${i + 1} ne peut pas être négative.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);

      // Determine images array
      const images = [];
      if (imagePreview) {
        images.push(imagePreview);
      } else if (imageUrlInput.trim()) {
        images.push(imageUrlInput.trim());
      } else {
        // Fallback luxury placeholder
        images.push('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80');
      }

      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        description: formData.description.trim(),
        images,
        badge: formData.badge,
        isBestSeller: formData.badge === 'best_seller',
        isActive: formData.isActive,
        variants: variants.map((v) => ({
          ml: Number(v.ml),
          price: Number(v.price),
          stock: Number(v.stock) || 0,
        })),
      };

      const res = await createProduct(payload);

      if (res.success && res.data) {
        setSuccessMsg('Le nouveau parfum a été ajouté avec succès au catalogue !');
        if (onProductAdded) {
          onProductAdded(res.data);
        }
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError(res.message || "Erreur lors de l'enregistrement du parfum.");
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(
        err.response?.data?.message ||
          "Une erreur s'est produite lors de la création du parfum. Veuillez vérifier les champs."
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
                Nouveau Flacon / Décante
              </span>
              <h2 className="font-playfair text-lg font-bold text-[#FFFDF9]">
                Ajouter un Parfum au Catalogue
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#999999] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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

          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Informations Générales */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111] mb-3 pb-1 border-b border-[#F4EFEA]">
                1. Informations Générales
              </h3>
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
                    placeholder="Ex: Gris Charnel, Oud Maracujá..."
                    className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                    Marque / Maison de Haute Parfumerie *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ex: BDK Parfums, Maison Crivelli, Dior..."
                    className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1">
                    Statut de Visibilité
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === true}
                        onChange={() => setFormData((p) => ({ ...p, isActive: true }))}
                        className="text-[#C5A880] focus:ring-[#C5A880]"
                      />
                      <span className="text-xs font-semibold text-[#111111]">Actif (En ligne)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === false}
                        onChange={() => setFormData((p) => ({ ...p, isActive: false }))}
                        className="text-[#888888] focus:ring-[#888888]"
                      />
                      <span className="text-xs font-medium text-[#777777]">Inactif (Brouillon)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Badge de Promotion */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111] mb-3 pb-1 border-b border-[#F4EFEA]">
                2. Badge Promotionnel
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'none', label: 'Aucun (Standard)', desc: 'Affichage classique' },
                  { id: 'best_seller', label: 'Best Seller ⭐', desc: 'Badge noir et or' },
                  { id: 'new_arrival', label: 'Nouveauté ✨', desc: 'Nouvel arrivage' },
                  { id: 'featured', label: 'Coup de Cœur 💎', desc: 'Mise en avant' },
                ].map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setFormData((p) => ({ ...p, badge: b.id }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.badge === b.id
                        ? 'border-[#C5A880] bg-[#FAF8F5] shadow-xs ring-1 ring-[#C5A880]'
                        : 'border-[#E7DAC7]/60 bg-white hover:border-[#C5A880]/50'
                    }`}
                  >
                    <span className="block text-xs font-bold text-[#111111]">{b.label}</span>
                    <span className="block text-[10px] text-[#888888] mt-0.5">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Visuel / Photo du Flacon */}
            <div>
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F4EFEA]">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
                  3. Photographie du Parfum
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      imageMode === 'upload' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    Importer un fichier
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      imageMode === 'url' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    Lien URL direct
                  </button>
                </div>
              </div>

              {imageMode === 'upload' ? (
                <div className="mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E7DAC7] hover:border-[#C5A880] rounded-2xl bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] cursor-pointer transition-all text-center"
                  >
                    <Upload size={24} className="text-[#C5A880] mb-2" />
                    <span className="text-xs font-bold text-[#111111]">
                      Cliquez pour importer la photo de la bouteille
                    </span>
                    <span className="text-[10px] text-[#888888] mt-1">
                      PNG, JPG, WEBP jusqu'à 5 Mo. Format carré ou portrait recommandé.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://... ou /products/mon-parfum.jpg"
                    className="flex-1 bg-[#F9F6F0] text-xs font-mono text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleUrlApply}
                    className="px-4 py-2.5 bg-[#111111] text-white rounded-xl text-xs font-semibold hover:bg-[#C5A880] transition-colors cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
              )}

              {/* Aperçu Visuel (Image Preview) */}
              {imagePreview && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-[#E7DAC7] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 bg-gradient-to-b from-[#FAF8F5] to-[#F3EEE7] rounded-lg overflow-hidden border border-[#E7DAC7] flex items-center justify-center p-1 relative">
                      <img
                        src={imagePreview}
                        alt="Aperçu du flacon"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#111111] block">
                        Aperçu du flacon sélectionné
                      </span>
                      <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check size={12} /> Image prête pour l'enregistrement
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer l'image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Description Olfactive */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111] mb-2 pb-1 border-b border-[#F4EFEA]">
                4. Description Olfactive & Notes *
              </h3>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Une symphonie envoûtante de bergamote de Calabre, de poivre du Sichuan et d'ambroxan noble..."
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all leading-relaxed"
              ></textarea>
            </div>

            {/* 5. Formats & Prix (Variants Dynamiques) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-1 border-b border-[#F4EFEA]">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
                    5. Formats & Prix (Variants)
                  </h3>
                  <span className="text-[10px] text-[#777777]">
                    Contenance en ML (5, 10, 30, 50, 100), prix en DH et stock disponible.
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddVariant(5, 90)}
                    className="text-[10px] font-semibold bg-[#F4EFEA] hover:bg-[#E7DAC7] px-2 py-1 rounded cursor-pointer"
                  >
                    +5ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant(10, 160)}
                    className="text-[10px] font-semibold bg-[#F4EFEA] hover:bg-[#E7DAC7] px-2 py-1 rounded cursor-pointer"
                  >
                    +10ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant(50, 650)}
                    className="text-[10px] font-semibold bg-[#F4EFEA] hover:bg-[#E7DAC7] px-2 py-1 rounded cursor-pointer"
                  >
                    +50ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant(100, 1200)}
                    className="text-[10px] font-semibold bg-[#F4EFEA] hover:bg-[#E7DAC7] px-2 py-1 rounded cursor-pointer"
                  >
                    +100ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant(30, 400)}
                    className="inline-flex items-center gap-1 bg-[#111111] hover:bg-[#C5A880] text-white text-[10px] font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors"
                  >
                    <Plus size={12} /> Autre Format
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {variants.map((v, index) => (
                  <div
                    key={index}
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
                        className="p-2 text-[#999999] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
            form="add-product-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{submitting ? 'Enregistrement...' : 'Enregistrer le parfum'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
