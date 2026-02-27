import { useState, useEffect } from 'react';
import { Layers, Activity, Droplets, Leaf, Navigation } from 'lucide-react';
import { Circle, Popup, useMap } from 'react-leaflet';

import { useNavigate } from 'react-router-dom';

// Helper to calculate "Life Score" based on environmental factors
// Oxygen (mg/L): >6 is good, <2 is hypoxic
// Plankton (mg/m3): >1 is bloom, <0.1 is barren
const calculateLifeScore = (oxygen, plankton) => {
    // Weighted Score: Oxygen (60%) + Plankton (40%)
    const oxygenScore = Math.min((oxygen / 8) * 100, 100);
    const planktonScore = Math.min((plankton / 2) * 100, 100);
    return (oxygenScore * 0.6) + (planktonScore * 0.4);
};

const BioScanner = ({ zones, enabled }) => {
    const map = useMap();
    const navigate = useNavigate();

    // Mock Environmental Data Simulation for each zone
    // In production, this would come from satellite APIs (NASA/NOAA)
    const [bioData, setBioData] = useState({});

    useEffect(() => {
        if (!zones) return;

        const data = {};
        zones.forEach(zone => {
            // Simulate realistic ocean data based on "confidence"
            // Higher confidence usually correlates with better ecosystem
            const baseOxygen = zone.confidence > 90 ? 7.5 : (zone.confidence > 80 ? 6.0 : 4.5);
            const basePlankton = zone.confidence > 90 ? 1.8 : (zone.confidence > 80 ? 1.2 : 0.5);

            // Add some randomness
            data[zone.id] = {
                oxygen: (baseOxygen + (Math.random() * 1 - 0.5)).toFixed(1),
                plankton: (basePlankton + (Math.random() * 0.5 - 0.25)).toFixed(1),
            };
            data[zone.id].score = calculateLifeScore(data[zone.id].oxygen, data[zone.id].plankton).toFixed(0);
        });
        setBioData(data);
    }, [zones]);

    if (!enabled) return null;

    return (
        <>
            {zones.map(zone => {
                const stats = bioData[zone.id];
                if (!stats) return null;

                const isThriving = stats.score > 80;
                const color = isThriving ? '#10B981' : (stats.score > 50 ? '#F59E0B' : '#EF4444');

                return (
                    <Circle
                        key={`bio-${zone.id}`}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius * 1.2} // Slightly larger than fishing zone
                        pathOptions={{
                            color: color,
                            fillColor: color,
                            fillOpacity: 0.2,
                            dashArray: '10, 10',
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="text-center min-w-[150px] bg-[#020617] text-white p-2">
                                <h3 className="font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 mb-3 text-[10px] italic">
                                    <Activity className="w-3 h-3" style={{ color }} />
                                    Bio-Scan Report
                                </h3>

                                <div className="space-y-2 text-sm mb-3">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" /> Oxygen</span>
                                        <span className="font-black text-blue-400 text-xs">{stats.oxygen} mg/L</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-400" /> Plankton</span>
                                        <span className="font-black text-emerald-400 text-xs">{stats.plankton} mg/m³</span>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Habitability</p>
                                        <div className="text-2xl font-black mb-1" style={{ color }}>
                                            {stats.score}/100
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                            {isThriving ? "Thriving Ecosystem" : "Stressed Ecosystem"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/route', { state: { zone: zone } })}
                                    className="w-full text-xs bg-gray-900 text-white font-bold px-3 py-2 rounded-md hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Navigation className="w-3 h-3 text-green-400" />
                                    Navigate Here
                                </button>
                            </div>
                        </Popup>
                    </Circle>
                );
            })}

            {/* Floating HUD for Bio-Scan Status */}
            <div className="leaflet-bottom leaflet-right" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
                <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl border border-green-500/30 shadow-2xl flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-green-400">Bio-Scan Active</h4>
                        <p className="text-[10px] text-gray-300">Analyzing Dissolved Oxygen & Chlorophyll</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BioScanner;
