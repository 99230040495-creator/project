import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Anchor, Wind, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const GlobalView = () => {
    const globeEl = useRef();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [points, setPoints] = useState([]);
    const [arcs, setArcs] = useState([]);
    const [hexBinPoints, setHexBinPoints] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [pendingAlerts, setPendingAlerts] = useState([]);

    useEffect(() => {
        // Auto-rotate
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }

        // 1. Generate Fleets (Points)
        const FLEET_COUNT = 15;
        const newPoints = Array.from({ length: FLEET_COUNT }).map((_, i) => ({
            id: i,
            lat: (Math.random() - 0.5) * 160, // Avoid poles
            lng: (Math.random() - 0.5) * 360,
            size: Math.random() / 3,
            color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
            name: `${t('vessel')}-${100 + i}`,
            status: Math.random() > 0.8 ? t('caution') : t('active')
        }));
        setPoints(newPoints);

        // 2. Generate Fish Zones (Hex Bin)
        const FISH_ZONE_COUNT = 500;
        const newHexPoints = Array.from({ length: FISH_ZONE_COUNT }).map(() => ({
            lat: (Math.random() - 0.5) * 160,
            lng: (Math.random() - 0.5) * 360,
            weight: Math.random() * 5 // Heat intensity
        }));
        setHexBinPoints(newHexPoints);


        // 3. Generate Weather Patterns (Arcs)
        const ARC_COUNT = 20;
        const newArcs = Array.from({ length: ARC_COUNT }).map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: ['#ff7a00', '#00b4d8'][Math.round(Math.random())] // Sunset or Aqua
        }));
        setArcs(newArcs);

        // 4. Fetch Active Alerts
        const fetchAlerts = async () => {
            try {
                const response = await api.get('/alerts');
                const data = response.data;
                const alertPoints = data.map(alert => ({
                    ...alert,
                    lat: alert.location.lat,
                    lng: alert.location.lng,
                    size: alert.type === 'sos' ? 0.8 : 0.4,
                    color: alert.type === 'sos' ? '#ff0000' : '#4ade80',
                    name: alert.type === 'sos' ? t('sos_signal') : t('fish_spotted'),
                    status: alert.message
                }));
                setAlerts(alertPoints);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }

            // Also load pending offline alerts
            try {
                const { getPendingAlerts } = await import('../services/offlineService');
                const pending = getPendingAlerts().map(alert => ({
                    ...alert,
                    lat: alert.location.lat,
                    lng: alert.location.lng,
                    size: alert.type === 'sos' ? 1.0 : 0.6, // Slightly larger to show importance
                    color: alert.type === 'sos' ? '#ff3333' : '#a7f3d0', // Muted colors for pending
                    name: `${t('pending')}: ${alert.type === 'sos' ? 'SOS' : 'FISH'}`,
                    status: t('awaiting_sync')
                }));
                setPendingAlerts(pending);
            } catch (e) {
                console.error("Error loading pending alerts:", e);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [t]);

    const CustomMarker = ({ d }) => {
        // Just using default points for now, but could be custom THREE objects
        return null;
    }

    return (
        <div className="relative w-full h-screen bg-[#000011] text-white overflow-hidden">
            {/* Overlay UI */}
            <div className="absolute top-0 left-0 p-8 z-50 w-full flex flex-col md:flex-row justify-between items-start pointer-events-none gap-6">
                <div className="pointer-events-auto flex flex-col items-start gap-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 glass-panel hover:bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 text-aqua-glow group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{t('return_command')}</span>
                    </button>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic leading-none mb-3">
                            Global <span className="text-aqua-glow">{t('commander')}</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium tracking-wide max-w-md leading-relaxed">
                            {t('global_commander_desc')}
                        </p>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="glass-panel p-8 rounded-[40px] border-white/5 space-y-6 w-full md:w-80 pointer-events-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-aqua-glow/5 blur-3xl rounded-full" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{t('active_units')}</span>
                            <span className="text-2xl font-black text-white italic">15</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{t('yield_sectors')}</span>
                            <span className="text-2xl font-black text-emerald-400 italic">08</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{t('atmospheric_risks')}</span>
                            <span className="text-2xl font-black text-rose-500 italic uppercase">{t('caution')}</span>
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-aqua-glow h-full w-2/3 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black text-aqua-glow uppercase tracking-widest mt-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-aqua-glow rounded-full animate-ping" />
                            {t('live_system_feed')}
                        </p>
                    </div>
                </div>
            </div>

            {/* The Globe */}
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Fleets & Alerts (Points)
                pointsData={[...points, ...alerts, ...pendingAlerts]}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.1}
                pointRadius="size"
                pointsMerge={false}
                onPointClick={(point) => setSelectedObject(point)}
                pointLabel={d => `
                    <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px;">
                        <b>${d.name}</b><br/>
                        Status: ${d.status}
                    </div>
                `}

                // Fish Zones (Hex Bin)
                hexBinPointsData={hexBinPoints}
                hexBinPointWeight="weight"
                hexBinResolution={4}
                hexMargin={0.2}
                hexTopColor={d => 'rgba(0, 255, 100, 0.8)'}
                hexSideColor={d => 'rgba(0, 150, 50, 0.6)'}
                hexBinMerge={true}

                // Weather (Arcs)
                arcsData={arcs}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={4}
                arcDashInitialGap={() => Math.random() * 5}
                arcDashAnimateTime={2000}
                arcsTransitionDuration={1000}

                // Atmosphere
                atmosphereColor="#00B4D8"
                atmosphereAltitude={0.25}
            />

            {/* Selected Object Detail Panel */}
            {selectedObject && (
                <div className="absolute bottom-10 right-10 p-8 glass-panel border-white/10 rounded-[40px] w-[320px] z-50 animate-in slide-in-from-bottom-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-aqua-glow/5 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight italic leading-tight">{selectedObject.name}</h3>
                            <button onClick={() => setSelectedObject(null)} className="p-2 glass-panel border-white/10 rounded-xl text-gray-600 hover:text-white transition-all">✕</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${selectedObject.status === t('caution') ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`} />
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{selectedObject.status}</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="p-2.5 bg-aqua-glow/10 rounded-xl">
                                    <Map className="w-4 h-4 text-aqua-glow" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-0.5">{t('tactical_coords')}</p>
                                    <p className="text-white text-[10px] font-black">{selectedObject.lat.toFixed(4)}°N, {selectedObject.lng.toFixed(4)}°E</p>
                                </div>
                            </div>
                            <button className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20">
                                {t('establish_uplink')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalView;
