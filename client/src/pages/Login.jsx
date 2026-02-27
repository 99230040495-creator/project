import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login: contextLogin, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await contextLogin(email.trim().toLowerCase(), password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden bg-mesh-gradient">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 80, 0], rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[15%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, 120, 0], y: [0, -60, 0], rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -left-[15%] w-[60%] h-[60%] bg-aqua-glow/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >

                <div className="glass-panel p-10 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aqua-glow to-transparent" />

                    <div className="text-center mb-10">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="inline-flex p-4 bg-white/5 rounded-3xl mb-6 shadow-inner border border-white/5"
                        >
                            <img src="/pwa-icon.svg" alt="AquaNova Logo" className="w-12 h-12" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic text-glow-aqua">
                            Welcome <span className="text-aqua-glow">Back</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-light">Sign in to your maritime dashboard.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.3em] text-blue-300 ml-2">{t('email_address')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-aqua-glow group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-blue-900/20 border border-white/10 rounded-3xl focus:border-aqua-glow focus:ring-0 outline-none transition-all text-white placeholder:text-gray-400 font-medium text-lg"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.3em] text-blue-300 ml-2">{t('password')}</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-aqua-glow group-focus-within:text-white transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-blue-900/20 border border-white/10 rounded-3xl focus:border-aqua-glow focus:ring-0 outline-none transition-all text-white placeholder:text-gray-400 font-medium text-lg"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-gray-500 hover:text-aqua-glow transition-colors uppercase tracking-widest">
                                    {t('forgot_password')}
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-3xl text-white font-black text-xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all uppercase tracking-[0.2em]"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                t('sign_in')
                            )}
                        </button>
                    </form>


                    <p className="text-center text-gray-500 font-medium">
                        {t('no_account')}{' '}
                        <Link to="/register" className="text-aqua-glow hover:underline decoration-2 underline-offset-4 font-bold tracking-tight">
                            {t('create_account')}
                        </Link>
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-sea" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                </div>
            </motion.div >
        </div >
    );
};

export default Login;
