import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Cpu,
    ArrowLeft,
    Wind,
    Zap,
    Activity,
    Navigation,
    Wifi,
    ShieldCheck,
    Waves,
    Target,
    ZapOff,
    Mic
} from 'lucide-react';

const NeptuneCore = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isAssembled, setIsAssembled] = useState(false);
    const [sonarPings, setSonarPings] = useState([]);
    const [vortexRotation, setVortexRotation] = useState(0);
    const [biometricScan, setBiometricScan] = useState(0);

    // Simulate biometric scan sequence
    useEffect(() => {
        const timer = setInterval(() => {
            setBiometricScan(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsAssembled(true), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(timer);
    }, []);

    // 3D Sonar Waterfall Simulation
    useEffect(() => {
        if (!isAssembled) return;
        const interval = setInterval(() => {
            setSonarPings(prev => {
                const newPing = {
                    id: Date.now(),
                    x: Math.random() * 100,
                    size: Math.random() * 20 + 10,
                    opacity: 1
                };
                return [newPing, ...prev.slice(0, 50)];
            });
        }, 150);
        return () => clearInterval(interval);
    }, [isAssembled]);

    // Vortex Gauge Physics
    useEffect(() => {
        if (!isAssembled) return;
        const interval = setInterval(() => {
            setVortexRotation(prev => prev + (Math.random() * 10 + 5));
        }, 50);
        return () => clearInterval(interval);
    }, [isAssembled]);

    if (!isAssembled) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999]">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-aqua-glow rounded-full"
                    />
                    <div className="text-center">
                        <h2 className="text-aqua-glow font-black text-xs tracking-[0.5em] uppercase mb-4 animate-pulse">Scanning Identity</h2>
                        <div className="text-4xl font-black text-white italic">{biometricScan}%</div>
                    </div>
                </div>
                <div className="absolute bottom-10 w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${biometricScan}%` }}
                        className="h-full bg-aqua-glow shadow-[0_0_15px_#0ea5e9]"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden font-sans select-none z-[2000]">
            {/* Immersive Deep Sea Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-blue-600/10 rounded-full blur-[200px]"
                />
            </div>

            <div className="relative h-full flex flex-col p-4 sm:p-8 pt-24 sm:pt-24 gap-8 overflow-y-auto pb-32">

                {/* Header Assembly */}
                <header className="flex justify-between items-start">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex gap-6 items-center"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-all hover:scale-110 group"
                        >
                            <ArrowLeft className="w-6 h-6 text-aqua-glow group-hover:-translate-x-2 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                                NEPTUNE <span className="text-aqua-glow">CORE</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 rounded-full bg-aqua-glow animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Tactical Command Protocol 0-1</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex gap-4">
                        <HUDStat icon={<Wifi className="w-4 h-4" />} label="Satellite" value="Linked" color="text-aqua-glow" />
                        <HUDStat icon={<ShieldCheck className="w-4 h-4" />} label="Security" value="Encrypted" color="text-emerald-400" />
                    </div>
                </header>

                {/* Main Tactical Grid */}
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* LEFT: 3D Sonar Waterfall */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 h-full flex flex-col gap-4"
                    >
                        <div className="flex-1 glass-panel border-white/10 rounded-[40px] p-8 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] italic text-blue-300 flex items-center gap-3">
                                    <Waves className="w-4 h-4 animate-pulse" /> 3D Sonar Waterfall
                                </h3>
                                <div className="bg-aqua-glow/10 px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border border-aqua-glow/20">Active Scan</div>
                            </div>

                            <div className="flex-1 relative bg-blue-950/20 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />

                                {/* Sonar Ping Animation */}
                                <div className="absolute inset-0 flex flex-col-reverse p-4">
                                    {sonarPings.map((ping, i) => (
                                        <motion.div
                                            key={ping.id}
                                            initial={{ y: 200, opacity: 1, scale: 0.5 }}
                                            animate={{ y: -600, opacity: 0, scale: 1.5 }}
                                            transition={{ duration: 4, ease: "linear" }}
                                            style={{ left: `${ping.x}%` }}
                                            className="absolute w-2 h-2 bg-aqua-glow rounded-full shadow-[0_0_15px_#0ea5e9]"
                                        />
                                    ))}
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5">
                                        {[...Array(5)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
                                    </div>
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                                        {[...Array(8)].map((_, i) => <div key={i} className="h-px w-full bg-white" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-end relative z-10">
                                <div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Floor Depth</span>
                                    <span className="text-3xl font-black italic text-white tracking-widest">142<span className="text-xs ml-1 text-aqua-glow">M</span></span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Fish Density</span>
                                    <span className="text-3xl font-black italic text-emerald-400 tracking-widest">High</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CENTER: Main Atmospheric Vortex */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-4 flex flex-col items-center justify-center relative"
                    >
                        {/* The Vortex Gauge */}
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                            {/* Outer Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-dashed border-aqua-glow/40 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border border-blue-500/20 rounded-full"
                            />

                            {/* Inner Vortex Assembly */}
                            <div className="relative w-52 h-52 sm:w-64 sm:h-64 bg-[#020617] rounded-full flex items-center justify-center shadow-[inset_0_0_50px_#0ea5e920] border border-white/5 overflow-hidden">
                                <motion.div
                                    style={{ rotate: vortexRotation }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            style={{ transform: `rotate(${i * 30}deg)` }}
                                            className="absolute h-full w-0.5 bg-gradient-to-t from-transparent via-aqua-glow/30 to-transparent"
                                        />
                                    ))}
                                </motion.div>

                                <div className="text-center z-10">
                                    <Wind className="w-10 h-10 text-aqua-glow mx-auto mb-4 animate-[bounce_2s_infinite]" />
                                    <div className="text-5xl font-black italic tracking-tighter text-white mb-1">24.8</div>
                                    <div className="text-[10px] font-black text-aqua-glow uppercase tracking-[0.4em] italic">Knots NE</div>
                                </div>
                            </div>

                            {/* Circular Indicators */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{ transform: `rotate(${i * 60 + vortexRotation * 0.2}deg)` }}
                                    className="absolute inset-0 py-8 flex items-start justify-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center max-w-xs">
                            <h2 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">NEPTUNE COMMAND</h2>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">System AI analyzing atmospheric pressure gradients and sea level anomalies</p>
                        </div>
                    </motion.div>

                    {/* RIGHT: System Logic & Biomass */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-4 h-full flex flex-col gap-6"
                    >
                        <div className="glass-panel border-white/10 rounded-[40px] p-8 hover-glow transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <Activity className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Biological Core</h3>
                            </div>
                            <div className="space-y-6">
                                <CoreMeter label="Plankton Concentration" value={82} color="bg-emerald-500" />
                                <CoreMeter label="Oxygen Saturation" value={65} color="bg-blue-500" />
                                <CoreMeter label="Thermal Consistency" value={91} color="bg-aqua-glow" />
                            </div>
                        </div>

                        <div className="flex-1 glass-panel border-white/10 rounded-[40px] p-8 flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <Target className="w-6 h-6 text-aqua-glow" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Tactical VOX</h3>
                            </div>

                            <div className="py-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Listening Buffer Active</span>
                                </div>
                                <div className="h-12 flex items-center gap-1">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, Math.random() * 40 + 10, 4] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                                            className="w-1 bg-aqua-glow rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-2xl hover:scale-105 transition-all shadow-xl hover:shadow-aqua-glow/20 pointer-events-auto">
                                Initialize AI Drive
                            </button>
                        </div>
                    </motion.div>

                </main>

                {/* Footer HUD elements */}
                <footer className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 pb-8 sm:pb-0">
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-blue-100">
                        <MinStat label="Voyage Timer" value="08:42:15" />
                        <MinStat label="Fuel Reserve" value="72.4%" />
                        <MinStat label="Calculated ROI" value="+15.2%" />
                    </div>
                    <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-md flex items-center gap-4 w-full sm:w-auto justify-center">
                        <Cpu className="w-5 h-5 text-aqua-glow animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core Processor: Stable</span>
                    </div>
                </footer>

            </div>
        </div>
    );
};

const HUDStat = ({ icon, label, value, color }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center gap-4">
        <div className={`p-2 bg-white/5 rounded-xl ${color}`}>{icon}</div>
        <div>
            <p className="text-[8px] font-black uppercase text-gray-500 tracking-[0.3em]">{label}</p>
            <p className="text-sm font-black italic uppercase tracking-widest">{value}</p>
        </div>
    </div>
);

const CoreMeter = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-gray-500 italic">{label}</span>
            <span className="text-white italic">{value}%</span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className={`h-full ${color} shadow-[0_0_10px_currentColor]`}
            />
        </div>
    </div>
);

const MinStat = ({ label, value }) => (
    <div>
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-2">{label}</span>
        <span className="text-2xl font-black italic tracking-widest leading-none">{value}</span>
    </div>
);

export default NeptuneCore;
