import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, getOrderStats } from '../api/orders';
import { getAdminProducts, deleteProduct } from '../api/products';
import Loader from '../components/Loader';
import EditProductModal from '../components/EditProductModal';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Trash2,
  Pencil
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('parfum_zaki_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, statsRes] = await Promise.all([
        getOrders({ limit: 50 }),
        getAdminProducts(),
        getOrderStats().catch(() => ({ data: null })),
      ]);

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('parfum_zaki_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      setMessage(`Statut de la commande mis à jour : "${newStatus}"`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer "${productName}" ?`)) {
      return;
    }
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setMessage(`Le produit "${productName}" a été supprimé.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erreur lors de la suppression du produit.');
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setMessage(`Le parfum "${updatedProduct.name}" a été modifié avec succès !`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('parfum_zaki_token');
    localStorage.removeItem('parfum_zaki_admin');
    navigate('/admin/login');
  };

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A38458] font-bold block mb-1">
            Espace d'Administration
          </span>
          <h1 className="font-playfair text-3xl font-bold text-[#111111]">
            Tableau de Bord Parfum Zaki
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-full border border-[#E7DAC7] text-[#111111] hover:bg-[#F9F6F0] transition-colors cursor-pointer"
            title="Actualiser les données"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-red-600 text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Temporary Alert Banner */}
      {message && (
        <div className="mt-4 bg-[#F4EFEA] border border-[#C5A880] text-[#111111] px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-[#A38458]" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="bg-white p-5 rounded-2xl border border-[#F4EFEA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] text-[#A38458] flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-bold block">
              Total Commandes
            </span>
            <span className="text-2xl font-bold text-[#111111]">
              {orders.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F4EFEA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] text-[#A38458] flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-bold block">
              Chiffre d'Affaires
            </span>
            <span className="text-2xl font-bold text-[#111111]">
              {orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + (o.total || 0) : sum), 0)}{' '}
              <span className="text-xs font-semibold text-[#A38458]">DH</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F4EFEA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-bold block">
              En Attente
            </span>
            <span className="text-2xl font-bold text-amber-700">
              {orders.filter((o) => o.status === 'pending').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F4EFEA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-bold block">
              Livrées
            </span>
            <span className="text-2xl font-bold text-green-700">
              {orders.filter((o) => o.status === 'delivered').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#F4EFEA] mb-6 space-x-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[#111111] border-b-2 border-[#111111]'
              : 'text-[#888888] hover:text-[#111111]'
          }`}
        >
          Commandes ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs uppercase tracking-widest font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'text-[#111111] border-b-2 border-[#111111]'
              : 'text-[#888888] hover:text-[#111111]'
          }`}
        >
          Catalogue Parfums ({products.length})
        </button>
      </div>

      {loading ? (
        <Loader text="Chargement des données en direct..." />
      ) : activeTab === 'orders' ? (
        /* ================= TAB 1: ORDERS ================= */
        <div className="bg-white rounded-2xl border border-[#F4EFEA] overflow-hidden shadow-xs">
          {/* Order status filters bar */}
          <div className="p-4 border-b border-[#F4EFEA] flex flex-wrap items-center justify-between gap-3 bg-[#F9F6F0]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              Filtrer par statut :
            </span>
            <div className="flex flex-wrap gap-2">
              {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#666666] border-[#E7DAC7] hover:border-[#111111]'
                  }`}
                >
                  {st === '' ? 'Toutes' : st}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#888888]">
              Aucune commande trouvée.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF9] text-[#888888] uppercase tracking-wider text-[10px] border-b border-[#F4EFEA]">
                  <tr>
                    <th className="py-3 px-4">N° Commande</th>
                    <th className="py-3 px-4">Client & Contact</th>
                    <th className="py-3 px-4">Ville & Adresse</th>
                    <th className="py-3 px-4">Articles</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFEA]">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#F9F6F0]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                        {order.orderNumber || 'PZ-00000'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#111111]">{order.customer?.fullName}</div>
                        <a
                          href={`https://wa.me/212${order.customer?.phone?.replace(/\D/g, '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#A38458] hover:underline"
                        >
                          {order.customer?.phone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-[#111111] block">{order.customer?.city}</span>
                        <span className="text-[11px] text-[#666666] line-clamp-1">{order.customer?.address}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-[#555555]">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="line-clamp-1">
                              • {it.productName || it.product?.name} × {it.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#111111] whitespace-nowrap">
                        {order.total} DH
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="pending">En attente (Pending)</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="shipped">Expédiée (Shipped)</option>
                          <option value="delivered">Livrée (Delivered)</option>
                          <option value="cancelled">Annulée (Cancelled)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-[#888888] whitespace-nowrap text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB 2: PRODUCTS ================= */
        <div className="bg-white rounded-2xl border border-[#F4EFEA] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#F4EFEA] flex justify-between items-center bg-[#F9F6F0]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              Liste des Parfums Actifs
            </span>
            <span className="text-[11px] text-[#888888]">
              {products.length} parfums enregistrés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF9] text-[#888888] uppercase tracking-wider text-[10px] border-b border-[#F4EFEA]">
                <tr>
                  <th className="py-3 px-4">Visuel</th>
                  <th className="py-3 px-4">Nom & Marque</th>
                  <th className="py-3 px-4">Formats & Prix (Variants)</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFEA]">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F9F6F0]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 bg-[#F9F6F0] rounded-lg overflow-hidden">
                        <img
                          src={
                            p.images?.[0] ||
                            'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#888888] font-bold block">
                        {p.brand}
                      </span>
                      <span className="font-playfair text-sm font-bold text-[#111111]">{p.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {p.variants?.map((v, i) => (
                          <span
                            key={i}
                            className="bg-[#F9F6F0] border border-[#E7DAC7] text-[#111111] px-2 py-0.5 rounded text-[10px] font-mono"
                          >
                            {v.ml}ml: <strong>{v.price}DH</strong> (Stock: {v.stock})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {p.isBestSeller ? (
                        <span className="bg-[#111111] text-[#E7DAC7] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          Best Seller
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#888888]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9F6F0] hover:bg-[#E7DAC7] text-[#111111] font-semibold text-[11px] uppercase tracking-wider transition-colors border border-[#E7DAC7] cursor-pointer"
                          title="Modifier ce parfum"
                        >
                          <Pencil size={13} className="text-[#A38458]" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer ce produit"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Modification de Produit */}
      {editingProduct && (
        <EditProductModal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
}
