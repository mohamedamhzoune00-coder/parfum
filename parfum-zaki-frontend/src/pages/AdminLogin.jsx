import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../api/auth';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@parfumzaki.ma');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await loginAdmin({ email, password });
      if (res.success && res.data?.token) {
        localStorage.setItem('parfum_zaki_token', res.data.token);
        localStorage.setItem('parfum_zaki_admin', JSON.stringify(res.data));
        navigate('/admin/dashboard');
      } else {
        setError('Échec de la connexion. Vérifiez vos identifiants.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
          'Identifiants incorrects ou serveur indisponible.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#F4EFEA] shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#111111] text-[#E7DAC7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck size={26} className="text-[#C5A880]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A38458] font-bold block mb-1">
            Espace Sécurisé
          </span>
          <h1 className="font-playfair text-2xl font-bold text-[#111111]">
            Connexion Administrateur
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Gestion du catalogue, des commandes et des statistiques
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parfumzaki.ma"
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] pl-10 pr-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#111111] mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F9F6F0] text-xs text-[#111111] pl-10 pr-4 py-3 rounded-xl border border-transparent focus:border-[#C5A880] focus:bg-white focus:outline-hidden transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#C5A880] text-[#FFFDF9] py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Se Connecter</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#F4EFEA] text-center">
          <p className="text-[11px] text-[#888888]">
            Compte de démonstration créé par le seed :
          </p>
          <code className="text-[10px] text-[#A38458] bg-[#F9F6F0] px-2 py-1 rounded inline-block mt-1 font-mono">
            admin@parfumzaki.ma / admin123456
          </code>
          <div className="mt-4">
            <Link to="/" className="text-xs text-[#666666] hover:text-[#111111] transition-colors underline">
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
