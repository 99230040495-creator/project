import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { majorIndianPorts } from '../data/ports';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { register: contextRegister, user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        boatType: 'small-vessel',
        location: majorIndianPorts[0].name,
        language: 'English'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await contextRegister({
                ...formData,
                email: formData.email.trim().toLowerCase()
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
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
                    className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, 120, 0], y: [0, -60, 0], rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-aqua-glow/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-6 md:p-8 rounded-[32px] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aqua-glow to-transparent" />

                    <div className="text-center mb-6">
                        <motion.div className="inline-flex p-2.5 bg-white/5 rounded-xl mb-3 shadow-inner border border-white/5">
                            <img src="/pwa-icon.svg" alt="AquaNova Logo" className="w-10 h-10" />
                        </motion.div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1 uppercase italic text-glow-aqua">
                            Join <span className="text-aqua-glow">AquaNova</span>
                        </h2>
                        <p className="text-gray-400 text-xs font-light">Secure onboarding in 60 seconds.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 ml-2">{t('full_name')}</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-aqua-glow transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 text-sm font-medium"
                                        placeholder="Enter Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 ml-2">{t('email')}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-aqua-glow transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 text-sm font-medium"
                                        placeholder="Enter Email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 ml-2">Home Port / Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-aqua-glow transition-colors" />
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white appearance-none text-sm font-medium [&>option]:bg-[#020617]"
                                        required
                                    >
                                        {majorIndianPorts.map((port) => (
                                            <option key={port.name} value={port.name}>
                                                {port.name} ({port.state})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 ml-2">{t('password')}</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-aqua-glow transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 text-sm font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl text-white font-black text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] disabled:opacity-50 transition-all uppercase tracking-widest mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('create_account')}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-white/5 text-center">
                        <p className="text-gray-500 font-medium">
                            {t('already_have_account')}{' '}
                            <Link to="/login" className="text-aqua-glow hover:underline font-bold tracking-tight">
                                {t('log_in_here')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
