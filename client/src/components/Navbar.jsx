import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Anchor, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('dashboard'), path: '/dashboard' },
        { name: t('set_route'), path: '/route' },
        { name: t('weather'), path: '/weather' },
        { name: t('sentinel'), path: '/sentinel' },
        { name: t('market'), path: '/market' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const hideOnRoutes = ['/login', '/register', '/forgot-password', '/global-view'];
    if (hideOnRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 h-20 flex items-center ${scrolled ? 'bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                <div className="flex items-center justify-between w-full h-full">
                    {/* Logo Section */}
                    <Link to="/dashboard" className="flex items-center gap-4 group shrink-0">
                        <div className="relative">
                            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white text-black rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-aqua-glow group-hover:text-white transition-all duration-500 shadow-xl overflow-hidden">
                                <Anchor className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-aqua-glow/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className="text-xl lg:text-2xl font-black tracking-tight uppercase text-white">
                            AQUA<span className="text-aqua-glow italic text-glow-aqua">NOVA</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-8 ml-auto">
                        <div className="flex items-center gap-6 xl:gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative flex items-center text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 h-10 ${location.pathname === link.path ? 'text-aqua-glow' : 'text-white/40 hover:text-white'}`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-aqua-glow shadow-[0_0_15px_#0ea5e9]"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="h-8 w-px bg-white/10" />

                        <div className="flex items-center gap-8">
                            <LanguageSwitcher />

                            {user ? (
                                <div className="flex items-center gap-6 pl-8 border-l border-white/10">
                                    <Link
                                        to="/profile"
                                        className="p-1 px-5 h-11 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-4 transition-all border border-white/5 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-gray-400 text-black flex items-center justify-center font-black text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                                            {user.name ? user.name.charAt(0) : 'C'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90">{user.name || t('captain')}</span>
                                            <span className="text-[7px] font-bold text-aqua-glow/60 uppercase tracking-widest leading-none">Active</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-white/20 hover:text-rose-500 transition-colors"
                                        title={t('logout')}
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">
                                        {t('login')}
                                    </Link>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                        >
                                            {t('join_network')}
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button - NOW VISIBLE UP TO LG BREAKPOINT */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[85%] bg-[#020617] border-l border-white/5 z-50 lg:hidden p-12 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-20">
                                <span className="text-2xl font-black tracking-tighter uppercase text-white">
                                    AQUA<span className="text-aqua-glow italic">NOVA</span>
                                </span>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-white/40">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Redundant links removed to favor BottomNav */}

                            <div className="mt-auto space-y-10">
                                <div className="p-8 glass-panel rounded-[32px] border-white/5">
                                    <LanguageSwitcher />
                                </div>

                                {user ? (
                                    <div className="flex flex-col gap-8">
                                        <div className="flex items-center gap-6 p-6 rounded-[32px] bg-white/5 border border-white/5">
                                            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center font-black text-2xl">
                                                {user.name ? user.name.charAt(0) : 'C'}
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase tracking-[0.2em]">{user.name || t('captain')}</p>
                                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full py-6 rounded-[24px] bg-rose-500/10 text-rose-500 font-black uppercase tracking-[0.3em] border border-rose-500/10"
                                        >
                                            Terminal Shutdown
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <button className="w-full py-6 rounded-[24px] glass-panel text-white/40 font-black uppercase tracking-[0.3em] border-white/5">
                                                {t('login')}
                                            </button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <button className="w-full py-6 rounded-[24px] bg-white text-black font-black uppercase tracking-[0.3em] shadow-2xl">
                                                {t('join_network')}
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
