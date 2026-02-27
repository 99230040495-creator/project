import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Wind, ShieldAlert, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const navLinks = [
        { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('set_route'), path: '/route', icon: Map },
        { name: t('weather'), path: '/weather', icon: Wind },
        { name: t('sentinel'), path: '/sentinel', icon: ShieldAlert },
        { name: t('market'), path: '/market', icon: Store }
    ];

    const hideOnRoutes = ['/login', '/register', '/forgot-password', '/'];
    if (hideOnRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden px-4 pb-6 pt-2">
            <div className="max-w-md mx-auto relative">
                {/* Glass Background */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" />

                <div className="relative flex items-center justify-around py-3 px-2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex flex-col items-center gap-1.5 relative group outline-none"
                            >
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        y: isActive ? -4 : 0
                                    }}
                                    className={`p-2 rounded-2xl transition-colors duration-300 ${isActive ? 'bg-aqua-glow text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    <link.icon className="w-5 h-5" />
                                </motion.div>

                                <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${isActive ? 'text-aqua-glow' : 'text-white/20'}`}>
                                    {link.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -top-1 w-1 h-1 bg-aqua-glow rounded-full shadow-[0_0_10px_#0ea5e9]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
