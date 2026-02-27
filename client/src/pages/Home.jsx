import React, { useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, Anchor, Shield, Waves, Navigation, Zap, Globe, Cpu, MoveRight, Layers, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const [user] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const { scrollYProgress } = useScroll();

    // Smooth scroll-driven parallax for the dashboard-style home
    const yHero = useTransform(scrollYProgress, [0, 0.4], [0, 150]);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-aqua-glow/30 overflow-x-hidden font-sans">

            {/* --- HERO: THE COMMAND CENTER --- */}
            <header className="relative h-screen flex items-center justify-center bg-black overflow-hidden px-6">
                <motion.div
                    style={{ y: yHero }}
                    className="absolute inset-0 z-0 opacity-40"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
                    <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
                    {/* Background Visual: Tactical Overlay */}
                    <div className="absolute inset-0 mask-radial scale-150 opacity-20">
                        <div className="w-full h-full border-[0.5px] border-aqua-glow/30 rounded-full animate-pulse-slow" />
                    </div>
                </motion.div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel-heavy border-aqua-glow/20 mb-12 text-aqua-glow text-[10px] font-black tracking-[0.4em] uppercase"
                        >
                            <Layers className="w-3 h-3" />
                            Operations Hub
                        </motion.div>

                        <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-10 uppercase italic text-white">
                            AQUA <span className="text-aqua-glow text-glow-aqua">NOVA</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-400 font-light max-w-3xl mx-auto mb-20 leading-relaxed italic border-r-2 border-aqua-glow/20 pr-8">
                            {t('hero_desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                            {user ? (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-16 py-6 bg-white text-black rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-aqua-glow hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                    >
                                        Open Tactical Console
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <button className="px-12 py-6 bg-aqua-glow text-white rounded-full text-xs font-black uppercase tracking-[0.3em] hover:scale-105 transition-all duration-500 shadow-2xl shadow-aqua-glow/30">
                                            {t('get_started_free')}
                                        </button>
                                    </Link>
                                    <Link to="/login">
                                        <button className="text-xs font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors duration-500 border-b border-white/5 pb-2">
                                            {t('sign_in')}
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* HUD Overlay */}
                <div className="absolute bottom-12 w-full flex justify-between px-12 opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-2 h-2 rounded-full bg-aqua-glow animate-pulse" />
                        <span>System Status: Optimal</span>
                    </div>
                    <span className="text-white">© 2026 AquaNova OS</span>
                </div>
            </header>

            {/* --- CAPABILITIES GRID --- */}
            <main className="bg-black relative pt-40 pb-60">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#020617] to-transparent pointer-events-none" />

                <section className="px-6 max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center mb-60">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-5xl md:text-8xl font-black mb-12 leading-none uppercase italic text-white">The New<br /><span className="text-aqua-glow">Standard</span></h2>
                            <p className="text-2xl text-gray-400 font-light leading-relaxed mb-12 italic border-l-4 border-aqua-glow pl-8">
                                {t('equipping_fishermen')}
                            </p>
                            <div className="flex gap-4">
                                <div className="p-4 glass-panel rounded-2xl border-aqua-glow/10">
                                    <BarChart3 className="w-6 h-6 text-aqua-glow" />
                                </div>
                                <div className="p-4 glass-panel rounded-2xl border-white/5">
                                    <Navigation className="w-6 h-6 text-white/40" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group"
                        >
                            <div className="absolute inset-0 bg-aqua-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                            <img
                                src="/assets/trawler.png"
                                alt="Fleet"
                                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s] scale-110 group-hover:scale-100"
                            />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={<Navigation />}
                            title={t('fish_pred_title')}
                            desc={t('fish_pred_desc')}
                            img="/assets/map_tactical.png"
                        />
                        <CapabilityCard
                            icon={<TrendingUp />}
                            title={t('market_ins_title')}
                            desc={t('market_ins_desc')}
                        />
                        <CapabilityCard
                            icon={<Shield />}
                            title={t('emergency_sos_title')}
                            desc={t('emergency_sos_desc')}
                        />
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="py-24 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-4">
                        <Anchor className="w-8 h-8 text-aqua-glow" />
                        <span className="text-2xl font-black italic tracking-tighter text-white">AQUA <span className="text-aqua-glow">NOVA</span></span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                        <a href="#" className="hover:text-aqua-glow transition-colors">Documentation</a>
                        <a href="#" className="hover:text-aqua-glow transition-colors">Protocol</a>
                        <a href="#" className="hover:text-aqua-glow transition-colors">Safety</a>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
                        AquaNova Command v2.4. All Channels Secured.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const CapabilityCard = ({ icon, title, desc, img }) => (
    <motion.div
        whileHover={{ y: -15 }}
        className="group relative h-[600px] rounded-[60px] overflow-hidden bg-white/5 border border-white/5 p-12 transition-all duration-700 flex flex-col justify-end"
    >
        {img && (
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
                <img src={img} alt={title} className="w-full h-full object-cover grayscale transition-transform duration-[3s] group-hover:scale-110" />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />

        <div className="relative z-20">
            <div className="mb-12 w-16 h-16 bg-aqua-glow text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(icon, { className: "w-8 h-8" })}
            </div>
            <h3 className="text-3xl font-black mb-6 uppercase italic leading-none text-white">{title}</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-8 group-hover:text-white transition-colors italic line-clamp-3">{desc}</p>
            <div className="flex items-center gap-3 text-aqua-glow text-[10px] font-black uppercase tracking-[0.5em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                Data Stream <MoveRight className="w-4 h-4" />
            </div>
        </div>
    </motion.div>
);

export default Home;
