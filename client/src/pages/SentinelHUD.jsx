import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Radar,
    Zap,
    ShieldAlert,
    Navigation,
    Compass,
    Anchor,
    Wind,
    Droplets,
    Cpu,
    Target,
    AlertTriangle,
    Volume2
} from 'lucide-react';

const SentinelHUD = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [scanPulse, setScanPulse] = useState(0);
    const [collisionRisk, setCollisionRisk] = useState(0); // 0 to 100
    const [fuelEfficiency, setFuelEfficiency] = useState(85);
    const [isGliding, setIsGliding] = useState(false);
    const [nearbyVessels, setNearbyVessels] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);

    // 1. Core Radar Animation Loop - Stable Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setScanPulse(prev => (prev + 1) % 100);

            // Simulate dynamic vessel movement
            if (Math.random() > 0.7) {
                const newVessel = {
                    id: Date.now(),
                    type: Math.random() > 0.5 ? t('vessel_cargo') : t('vessel_tanker'),
                    dist: Math.random() * 5 + 1,
                    bearing: Math.random() * 360,
                    speed: Math.random() * 20 + 10,
                    onCollisionCourse: Math.random() > 0.8
                };
                setNearbyVessels(prev => [...prev.slice(-10), newVessel]);

                if (newVessel.onCollisionCourse) {
                    setCollisionRisk(prev => {
                        const nextRisk = Math.min(100, prev + 25);
                        if (nextRisk > 50) {
                            setActiveAlert({
                                title: t('collision_detected'),
                                desc: `${newVessel.type} ${t('approaching_at')} ${Math.round(newVessel.speed)} ${t('knots')}`,
                                severity: 'Critical'
                            });
                        }
                        return nextRisk;
                    });
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [t]); // Depend on t for initial translation, but risk updates don't restart interval

    // 2. Efficiency Glide Logic
    useEffect(() => {
        const glideCheck = setInterval(() => {
            const currentFavorable = Math.random() > 0.6;
            setIsGliding(currentFavorable);
            if (currentFavorable) {
                setFuelEfficiency(prev => Math.min(100, prev + 5));
            } else {
                setFuelEfficiency(prev => Math.max(40, prev - 2));
            }
        }, 5000);
        return () => clearInterval(glideCheck);
    }, []);

    return (
        <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden font-sans pt-20">
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-mesh-gradient" />

            {/* Main HUD Container */}
            <div className="relative h-full w-full p-4 sm:p-8 flex flex-col items-center justify-between overflow-y-auto pb-32">

                {/* TOP BAR: Navigation & Connectivity */}
                <div className="w-full flex justify-between items-start z-50">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <Cpu className="w-5 h-5 text-aqua-glow group-hover:rotate-90 transition-transform duration-500" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] italic">{t('sentinel_os')} v1.0</span>
                        </button>
                        <div className="flex items-center gap-2 mt-4 ml-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{t('tactical_link')}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-3xl backdrop-blur-md">
                            <div className="flex items-center justify-end gap-3 mb-1">
                                <ShieldAlert className={`w-6 h-6 ${collisionRisk > 50 ? 'text-red-500 animate-ping' : 'text-gray-600'}`} />
                                <span className="text-sm font-black text-white italic uppercase tracking-widest">{t('safety_integrity')}</span>
                            </div>
                            <p className={`text-4xl font-black ${collisionRisk > 50 ? 'text-red-500' : 'text-emerald-400'}`}>
                                {100 - collisionRisk}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Primary Tactical Display */}
                <div className="relative flex-1 flex items-center justify-center w-full max-w-4xl min-h-[300px] md:min-h-[400px]">

                    {/* The Radar Circle */}
                    <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[450px] md:h-[450px] border-2 border-aqua-glow/20 rounded-full flex items-center justify-center">
                        <div className="absolute inset-0 border-[20px] border-white/5 rounded-full" />

                        {/* Scanning Sweep */}
                        <motion.div
                            style={{ rotate: scanPulse * 3.6 }}
                            className="absolute inset-0 bg-gradient-to-t from-transparent via-aqua-glow/10 to-transparent rounded-full pointer-events-none"
                        />

                        {/* Compass Notches */}
                        {[0, 90, 180, 270].map(deg => (
                            <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute inset-0 flex flex-col items-center py-4 pointer-events-none">
                                <span className="text-[10px] font-black text-white/20 italic tracking-widest">
                                    {deg === 0 ? t('north') : deg === 90 ? t('east') : deg === 180 ? t('south') : t('west')}
                                </span>
                            </div>
                        ))}

                        {/* Center Point (User) */}
                        <div className="relative z-10 p-3 md:p-4 bg-white rounded-full shadow-[0_0_30px_white]">
                            <Anchor className="w-6 h-6 md:w-8 md:h-8 text-black" strokeWidth={3} />
                            <div className="absolute -inset-8 border border-white/20 rounded-full animate-ping opacity-20" />
                        </div>

                        {/* Nearby Vessel Indicators */}
                        {nearbyVessels.map(v => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    left: `calc(50% + ${Math.cos(v.bearing * Math.PI / 180) * (v.dist * 35)}px)`,
                                    top: `calc(50% + ${Math.sin(v.bearing * Math.PI / 180) * (v.dist * 35)}px)`
                                }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`p-1.5 rounded-lg ${v.onCollisionCourse ? 'bg-red-500 animate-bounce' : 'bg-gray-700'}`}>
                                        <Navigation className="w-4 h-4 text-white" style={{ transform: `rotate(${Math.round(v.bearing)}deg)` }} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter mt-1 bg-black/60 px-1 rounded">{v.type}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Left Wing: Environmental Feed */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 hover-glow w-48">
                            <div className="flex items-center gap-3 mb-3">
                                <Wind className="w-5 h-5 text-aqua-glow" />
                                <span className="text-[10px] font-black uppercase text-gray-400 italic">{t('current_flow')}</span>
                            </div>
                            <p className="text-2xl font-black text-white italic">12.4 <span className="text-[10px] text-aqua-glow uppercase">{t('knots')}</span></p>
                            <div className="mt-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3 rotate-45" /> {t('se_drift')}
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 hover-glow w-48">
                            <div className="flex items-center gap-3 mb-3">
                                <Droplets className="w-5 h-5 text-blue-400" />
                                <span className="text-[10px] font-black uppercase text-gray-400 italic">{t('surface_temp')}</span>
                            </div>
                            <p className="text-2xl font-black text-white italic">28.5 <span className="text-[10px] text-blue-400 uppercase">{t('celsius')}</span></p>
                        </div>
                    </div>

                    {/* Right Wing: Fleet Intelligence */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 hover-glow w-56">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-5 h-5 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase text-gray-400 italic">{t('next_fish_zone')}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{t('distance')}</span>
                                    <span className="text-xl font-black text-white italic">3.2 {t('km')}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full w-[70%]" />
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-[2rem] border transition-all duration-500 w-56 ${isGliding ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className={`w-5 h-5 ${isGliding ? 'text-emerald-400 animate-spin' : 'text-gray-600'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest italic text-white">{t('fuel_efficiency')}</span>
                            </div>
                            <p className={`text-[10px] leading-relaxed font-black uppercase tracking-tight italic ${isGliding ? 'text-emerald-400' : 'text-white/40'}`}>
                                {isGliding ? t('optimal_drift') : t('constant_thrust')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM: Critical Warnings & Action Bar */}
                <div className="w-full flex flex-col items-center gap-8 py-6 z-50">

                    <AnimatePresence>
                        {activeAlert && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className={`w-full max-w-2xl p-6 rounded-[2.5rem] border-2 backdrop-blur-3xl flex items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${activeAlert.severity === 'Critical' ? 'bg-red-600/20 border-red-500/50' : 'bg-amber-600/20 border-amber-500/50'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/10 rounded-[1.5rem]">
                                        <AlertTriangle className={`w-8 h-8 ${activeAlert.severity === 'Critical' ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black italic tracking-tight uppercase leading-none mb-1">{activeAlert.title}</h4>
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{activeAlert.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveAlert(null)}
                                    className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    {t('acknowledge')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Fuel Consumption Stats */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 glass-panel px-8 sm:px-12 py-4 sm:py-6 rounded-3xl sm:rounded-full border-white/5 w-full sm:w-auto">
                        <div className="text-center">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-2">{t('fuel_reserve')}</span>
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-2.5 h-6 bg-emerald-500 rounded-sm" />
                                <div className="w-2.5 h-6 bg-emerald-500 rounded-sm" />
                                <div className="w-2.5 h-6 bg-emerald-500 rounded-sm" />
                                <div className="w-2.5 h-6 bg-white/10 rounded-sm" />
                                <span className="text-2xl font-black text-white italic ml-2">72%</span>
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-10 bg-white/10" />

                        <div className="text-center">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-2">{t('voyage_profits')}</span>
                            <p className="text-2xl font-black text-aqua-glow italic">{t('currency_symbol')}4,850.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentinelHUD;
