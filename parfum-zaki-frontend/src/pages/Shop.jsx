import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../api/products';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchShopProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (sort) params.sort = sort;
      if (selectedCategory) params.category = selectedCategory;

      const res = await getProducts(params);
      setProducts(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching shop products:', err);
      setError('Impossible de charger les produits. Veuillez réessayer ultérieurement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopProducts();
  }, [sort, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchShopProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#A38458] font-semibold block mb-2">
          Catalogue Exclusif
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-[#111111]">
          Notre Boutique de Parfums
        </h1>
        <p className="text-sm text-[#666666] mt-3">
          Tous nos parfums sont certifiés 100% originaux, disponibles en décantes 10ML et flacons complets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#F4EFEA] shadow-xs mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher un parfum, une marque..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F9F6F0] text-xs text-[#111111] pl-10 pr-4 py-3 rounded-full border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
        </form>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <SlidersHorizontal size={15} className="text-[#888888] hidden sm:block" />
          <span className="text-xs uppercase tracking-wider text-[#666666] hidden sm:inline font-medium">Trier par :</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#F9F6F0] text-xs text-[#111111] font-medium px-4 py-3 rounded-full border border-transparent focus:border-[#C5A880] focus:outline-hidden transition-all cursor-pointer"
          >
            <option value="">Nouveautés d'abord</option>
            <option value="price_asc">Prix : Croissant</option>
            <option value="price_desc">Prix : Décroissant</option>
            <option value="name">Nom alphabétique</option>
          </select>
        </div>
      </div>

      {/* Products Results Grid */}
      {loading ? (
        <Loader text="Recherche des parfums en cours..." />
      ) : error ? (
        <div className="bg-[#FFFDF9] border border-red-200 text-red-700 px-6 py-12 rounded-xl text-center max-w-lg mx-auto">
          <p className="text-sm">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#F9F6F0] rounded-2xl max-w-2xl mx-auto px-4">
          <Sparkles size={32} className="text-[#C5A880] mx-auto mb-3" />
          <h3 className="font-playfair text-xl font-bold text-[#111111] mb-1">Aucun parfum trouvé</h3>
          <p className="text-xs text-[#666666] max-w-sm mx-auto mb-6">
            Essayez de modifier vos termes de recherche ou réinitialisez les filtres.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSort('');
              setSelectedCategory('');
              fetchShopProducts();
            }}
            className="bg-[#111111] text-[#FFFDF9] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full hover:bg-[#C5A880] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-xs uppercase tracking-wider text-[#888888]">
            Affichage de <span className="font-bold text-[#111111]">{products.length}</span> parfums d'exception
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
