// Stability verified
import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Gauge, TrendingUp, Zap, Anchor, Shield, Globe, ChevronDown, MousePointer2, Fish, Wind, Radio, Waves, Users, Cpu, BarChart3, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing = () => {
    const { t } = useTranslation();
    const { scrollYProgress } = useScroll();
    const [hoveredCard, setHoveredCard] = useState(null);

    // Parallax effects
    const yHero = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scaleGlobe = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const featureVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: (index) => ({
            scale: 1,
            opacity: 1,
            transition: { delay: index * 0.1, duration: 0.6 }
        })
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const features = [
        {
            icon: Fish,
            title: "Bio Scanning",
            desc: "Real-time aquatic life detection and species identification with AI-powered analytics."
        },
        {
            icon: Wind,
            title: "Weather Intel",
            desc: "Precision maritime weather forecasting and wind pattern analysis for optimal routes."
        },
        {
            icon: BarChart3,
            title: "Market Analytics",
            desc: "Live market price tracking and predictive analysis across major fishing harbors."
        },
        {
            icon: Radio,
            title: "Vessel Comm",
            desc: "Integrated communication hub for crew coordination and emergency protocols."
        },
        {
            icon: Waves,
            title: "Route Optimize",
            desc: "AI-calculated optimal fishing routes with fuel efficiency and catch predictions."
        },
        {
            icon: Shield,
            title: "Safety Systems",
            desc: "Advanced collision detection and emergency SOS broadcasting technology."
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-aqua-glow/30 overflow-x-hidden">

            {/* ====== HERO SECTION ====== */}
            <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-mesh-gradient" />

                    {/* Animated orbs */}
                    <motion.div
                        animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ x: [0, -50, 50, 0], y: [0, -30, 30, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-aqua-glow/20 rounded-full blur-[120px]"
                    />
                </div>

                {/* Hero Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center max-w-6xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-panel-heavy text-aqua-glow text-xs font-black tracking-[0.2em] uppercase mb-12 border-aqua-glow/20 shadow-[0_0_30px_rgba(14,165,233,0.15)]"
                    >
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Zap className="w-4 h-4 fill-aqua-glow" />
                        </motion.div>
                        Maritime Intelligence System
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Zap className="w-4 h-4 fill-aqua-glow" />
                        </motion.div>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 flex flex-col gap-4"
                    >
                        <span className="bg-gradient-to-r from-white via-aqua-glow to-blue-400 bg-clip-text text-transparent">
                            Next Gen
                        </span>
                        <span className="text-aqua-glow italic text-glow-aqua">Fishing Intelligence</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-12"
                    >
                        Powered by AI, blockchain security, and real-time maritime sensors. Navigate smarter, fish faster, earn better.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                    >
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.08, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-10 py-4 md:px-14 md:py-5 bg-white text-black rounded-full text-sm font-black uppercase tracking-[0.15em] overflow-hidden shadow-lg"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </span>
                                <motion.div className="absolute inset-0 bg-aqua-glow -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                            </motion.button>
                        </Link>

                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.08, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 md:px-14 md:py-5 border-2 border-white/30 hover:border-aqua-glow text-white rounded-full text-sm font-black uppercase tracking-[0.15em] transition-colors duration-300"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center"
                    >
                        <ChevronDown className="w-6 h-6 text-aqua-glow/50" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ====== FEATURES SECTION ====== */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Powered by <span className="text-aqua-glow">Advanced</span> Technology
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-aqua-glow to-transparent mx-auto" />
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                custom={idx}
                                variants={featureVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative group"
                            >
                                {/* Card Background */}
                                <motion.div
                                    animate={{
                                        y: hoveredCard === idx ? -10 : 0,
                                        boxShadow: hoveredCard === idx
                                            ? "0 40px 60px rgba(14, 165, 233, 0.3)"
                                            : "0 10px 30px rgba(0, 0, 0, 0.2)"
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-aqua-glow/50 transition-colors duration-300 h-full"
                                >
                                    {/* Icon Container */}
                                    <motion.div
                                        animate={{
                                            rotate: hoveredCard === idx ? 12 : 0,
                                            scale: hoveredCard === idx ? 1.1 : 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-aqua-glow/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-shadow duration-300"
                                    >
                                        <feature.icon className="w-8 h-8 text-aqua-glow" />
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>

                                    {/* Hover Arrow */}
                                    <motion.div
                                        animate={{ x: hoveredCard === idx ? 8 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-6 text-aqua-glow"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>

                                    {/* Gradient Border */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-aqua-glow/0 via-aqua-glow/0 to-aqua-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== STATS SECTION ====== */}
            <section className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Users", value: "2.5K+" },
                        { label: "Fishing Zones", value: "847" },
                        { label: "Catch Rate Boost", value: "34%" },
                        { label: "Uptime", value: "99.9%" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center group"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                                className="text-4xl md:text-5xl font-black text-aqua-glow mb-2"
                            >
                                {stat.value}
                            </motion.div>
                            <p className="text-gray-400 font-medium">{stat.label}</p>
                            <div className="h-1 w-12 bg-gradient-to-r from-aqua-glow to-transparent mx-auto mt-3 group-hover:w-16 transition-all duration-300" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ====== CTA SECTION ====== */}
            <section className="relative py-32 px-6 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, 20, -20, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]"
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-8">
                            Ready to Transform Your <span className="text-aqua-glow">Fishing Operations?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                            Join thousands of fishermen using AquaNova to make smarter decisions, optimize routes, and maximize catch. No credit card required.
                        </p>

                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative px-16 py-6 bg-gradient-to-r from-aqua-glow to-blue-500 text-black rounded-full text-lg font-black uppercase tracking-[0.15em] shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:shadow-[0_0_60px_rgba(14,165,233,0.6)] transition-shadow duration-300"
                                >
                                    <span className="flex items-center gap-3">
                                        Start Your Free Trial
                                        <ArrowRight className="w-6 h-6" />
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
