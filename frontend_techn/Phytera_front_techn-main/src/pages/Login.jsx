import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import loginBg from '../assets/login_bg.png';

import { authService } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            await authService.login(email, password);
            setIsLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setIsLoading(false);
            setErrorMsg(err.message || 'Échec de la connexion');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />

                <div className="relative z-20 flex flex-col justify-end p-16 pb-24 w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                            <Leaf className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">PhyTera</h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                        Optimisez vos rendements agricoles grâce à l'intelligence artificielle et aux drones autonomes.
                    </p>

                    <div className="mt-8 flex gap-4 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            <span>Monitoring 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            <span>Alertes prédictives</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            <span>Ecologie contrôlée</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-md w-full relative z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email professionnel</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                                    placeholder="nom@phytera.tech"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                                    Oublié ?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-base shadow-lg shadow-cyan-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connexion en cours...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Se connecter <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Pas encore de compte ?{' '}
                        <a href="#" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                            Demander une démo
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
