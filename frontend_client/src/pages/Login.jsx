import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { authService } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isRegister) {
            if (formData.password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères.');
                setLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas.');
                setLoading(false);
                return;
            }
        }

        try {
            const res = isRegister
                ? await authService.register({
                    email: formData.email.trim(),
                    password: formData.password,
                    nom: formData.nom.trim(),
                })
                : await authService.login({
                    email: formData.email.trim(),
                    password: formData.password,
                });

            // Session valide uniquement si le backend a renvoyé un vrai token + utilisateur
            if (!res?.accessToken || !res?.user) {
                throw new Error('Réponse invalide du serveur. Veuillez réessayer.');
            }

            // Cette application est dédiée aux agriculteurs
            if (res.user.role !== 'AGRICULTEUR') {
                authService.logout();
                throw new Error('Ce compte n\'est pas un compte agriculteur. Utilisez l\'espace Technicien ou Administrateur.');
            }

            navigate('/');
        } catch (err) {
            console.error('Auth error:', err.message);
            setError(err.message || 'Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-navy-950 text-white font-sans overflow-y-auto">
            {/* Left Side - Visual/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2540&auto=format&fit=crop')] bg-cover bg-center opacity-40 hover:scale-105 transition-transform duration-[20s]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/80 to-navy-900/40"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-navy-950"></div>
                </div>

                <div className="relative z-10">
                    <Logo size="lg" className="mb-6" />
                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-5xl font-bold leading-tight">
                            L'Agriculture de <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">Demain</span>, Aujourd'hui.
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Pilotez vos exploitations avec l'intelligence artificielle et l'IoT avancée NestJS/Prisma.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 glass-panel p-6 rounded-2xl border-l-4 border-neon-green max-w-md">
                    <p className="text-gray-300">Suivi des sols, alertes et diagnostic IA de vos parcelles, alimentés par vos boîtiers IoT PhyTera.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative min-h-screen py-8">
                <div className="absolute top-10 right-10 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-neon-violet/10 rounded-full blur-3xl"></div>

                <div className="max-w-md w-full glass-panel p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl relative z-10 shadow-2xl border border-white/5 space-y-5 sm:space-y-6">
                    <div className="lg:hidden flex justify-center mb-1">
                        <Logo size="md" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
                            {isRegister ? 'Créer un Compte Agriculteur' : 'Bienvenue sur PHYTERA'}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            {isRegister ? 'Rejoignez la plateforme agro-technologique' : 'Connectez-vous à votre espace agronomique'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-300 uppercase ml-1">Nom complet *</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            className="w-full bg-navy-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue transition-all"
                                            placeholder="Ex: Jean Mukendi"
                                        />
                                    </div>
                                </div>

                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-300 uppercase ml-1">Email *</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-navy-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue transition-all"
                                    placeholder="nom@phytera.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-300 uppercase ml-1">Mot de passe * (min 6 car.)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-navy-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase ml-1">Confirmer le mot de passe *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-navy-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan text-navy-900 font-bold py-3.5 rounded-xl shadow-lg shadow-neon-blue/25 hover:shadow-neon-blue/40 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    {isRegister ? 'Créer le Compte & Se Connecter' : 'Se Connecter'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-400 pt-2">
                        {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError(null);
                            }}
                            className="text-white hover:text-neon-blue font-semibold transition-colors underline ml-1"
                        >
                            {isRegister ? 'Se connecter' : 'Créer un compte'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
