import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Navigation, Calculator, AlertTriangle, Fuel, Fish, TrendingUp, DollarSign, CloudRain } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import MarketTicker from '../components/MarketTicker';
import SentinelCompass from '../components/SentinelCompass';
import { indianHarbours } from '../data/harbours';
import { Compass, Map as MapIcon } from 'lucide-react';

// Helper to update map view
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Simple Haversine Distance (in km)
const calculateDistance = (coord1, coord2) => {
    const R = 6371; // km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Helper to get fish image path
const getFishImage = (speciesName) => {
    const name = speciesName.toLowerCase();
    if (name.includes('pomfret')) return '/fish/pomfret.svg';
    if (name.includes('mackerel') || name.includes('mackrel')) return '/fish/mackerel.svg';
    if (name.includes('tuna')) return '/fish/tuna.svg';
    if (name.includes('prawn') || name.includes('shrimp')) return '/fish/prawns.svg';
    if (name.includes('sardine')) return '/fish/sardine.svg';
    return '/fish/pomfret.svg'; // Default
};

const RouteOptimization = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [calculating, setCalculating] = useState(false);
    const [route, setRoute] = useState(null);
    const [catchWeight, setCatchWeight] = useState(500); // kg
    const [selectedSpecies, setSelectedSpecies] = useState('Pomfret');
    const [bestHarbour, setBestHarbour] = useState(null);
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'compass'

    // Use passed zone coordinates or default
    const zoneCoords = location.state?.zone ? [location.state.zone.lat, location.state.zone.lng] : [19.0, 72.7];
    const locationName = location.state?.zone?.locationName || t('fishing_zone_a');
    const zoneSpecies = location.state?.zone?.species || ['Pomfret', 'Mackerel']; // Fallback species

    const [tripDirection, setTripDirection] = useState('inbound'); // 'outbound' (Harbour -> Zone) or 'inbound' (Zone -> Harbour)

    const marketPricesBase = {
        'Pomfret': 1000,
        'Surmai': 600,
        'Prawns': 450,
        'Mackerel': 200
    };

    const handleCalculate = () => {
        setCalculating(true);
        setTimeout(() => {
            const fuelPrice = 100; // per Liter
            const mileage = 2; // km per Liter

            // 1. Find Nearest Harbour (Home Port)
            let nearestHarbour = indianHarbours.map(h => ({
                ...h,
                distance: calculateDistance(zoneCoords, h.coords)
            })).reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);

            // Add safe defaults for outbound to preventing rendering crash
            nearestHarbour = {
                ...nearestHarbour,
                marketPrice: 0,
                netProfit: 0,
                fuelCost: (nearestHarbour.distance / mileage) * fuelPrice
            };

            // 2. Find Best Selling Harbour (Smart Trade)
            const harboursWithStats = indianHarbours.map(h => ({
                ...h,
                distance: calculateDistance(zoneCoords, h.coords)
            })).sort((a, b) => a.distance - b.distance).slice(0, 5);

            const results = harboursWithStats.map(harbour => {
                const marketPrice = marketPricesBase[selectedSpecies] * harbour.priceMod;
                const revenue = marketPrice * catchWeight;
                const fuelCost = (harbour.distance / mileage) * fuelPrice;
                const netProfit = revenue - fuelCost;
                return { ...harbour, marketPrice, revenue, fuelCost, netProfit };
            });

            const bestSellingHarbour = results.reduce((prev, curr) => (prev.netProfit > curr.netProfit) ? prev : curr);

            // Determine Route based on Direction
            if (tripDirection === 'outbound') {
                // Harbour -> Zone
                setBestHarbour(nearestHarbour);
                setRoute({
                    path: [nearestHarbour.coords, zoneCoords],
                    fuel: `${(nearestHarbour.distance / mileage).toFixed(1)}L`,
                    time: `${(nearestHarbour.distance / 10).toFixed(1)}h`,
                    profit: 0,
                    comparison: `${t('departing_from')} ${nearestHarbour.name}`
                });
            } else {
                // Zone -> Harbour (Selling)
                setBestHarbour(bestSellingHarbour);
                setRoute({
                    path: [zoneCoords, bestSellingHarbour.coords],
                    fuel: `${(bestSellingHarbour.distance / mileage).toFixed(1)}L`,
                    time: `${(bestSellingHarbour.distance / 10).toFixed(1)}h`,
                    profit: bestSellingHarbour.netProfit,
                    comparison: bestSellingHarbour.name === nearestHarbour.name ? t('nearest_is_best') : `${t('switching_to')} ${bestSellingHarbour.name} ${t('earns_you')} ₹${(bestSellingHarbour.netProfit - results.find(h => h.name === nearestHarbour.name)?.netProfit || 0).toFixed(0)} ${t('more')}!`
                });
            }
            setCalculating(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-aqua-glow/5 rounded-full blur-[120px]" />
            </div>
            <MarketTicker />

            <div className="p-4 flex flex-col lg:flex-row gap-6 flex-1">
                {/* Sidebar Controls */}
                <div className="w-full lg:w-[380px] glass-panel border-white/5 rounded-[40px] p-8 relative z-10 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <Navigation className="w-6 h-6 text-aqua-glow" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{t('route')} <span className="text-aqua-glow">{t('ai')}</span></h2>
                    </div>

                    <div className="space-y-6">
                        {/* Trip Direction Toggle */}
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setTripDirection('outbound')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tripDirection === 'outbound' ? 'bg-white text-[#020617] shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                {t('deployment')}
                            </button>
                            <button
                                onClick={() => setTripDirection('inbound')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tripDirection === 'inbound' ? 'bg-aqua-glow text-[#020617] shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                {t('extraction')}
                            </button>
                        </div>

                        <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                            <h3 className="text-white text-[10px] font-black flex items-center gap-2 mb-4 uppercase tracking-[0.2em]">
                                <Fish className="w-3.5 h-3.5 text-aqua-glow" /> {t('catch_parameters')}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-gray-600 text-[10px] uppercase font-black tracking-widest ml-1">{t('species')}</label>
                                    <select
                                        value={selectedSpecies}
                                        onChange={(e) => setSelectedSpecies(e.target.value)}
                                        className="w-full bg-[#020617] border border-white/5 rounded-xl p-2.5 text-white text-xs font-black uppercase tracking-widest outline-none [&>option]:bg-[#020617]"
                                    >
                                        {Object.keys(marketPricesBase).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-gray-600 text-[10px] uppercase font-black tracking-widest ml-1">{t('payload')} (kg)</label>
                                    <input
                                        type="number"
                                        value={catchWeight}
                                        onChange={(e) => setCatchWeight(Number(e.target.value))}
                                        className="w-full bg-[#020617] border border-white/5 rounded-xl p-2.5 text-white text-xs font-black outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm">{t('location')}</label>
                            <input type="text" value={`${t('current')}: ${locationName}`} readOnly className="w-full bg-ocean/50 border border-white/10 rounded-lg p-3 text-white" />
                        </div>

                        {/* Likely Catch Visuals */}
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-300 mb-2 font-semibold">{t('likely_catch_in_zone')}:</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {zoneSpecies.map((species, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-20 flex flex-col items-center">
                                        <div className="w-16 h-12 bg-white/10 rounded-md mb-1 flex items-center justify-center p-1">
                                            <img src={getFishImage(species)} alt={species} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] text-gray-300 text-center leading-tight">{species}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            disabled={calculating}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            {calculating ? (
                                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> {t('analyzing_intel')}</span>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4" />
                                    {t('initial_analysis')}
                                </>
                            )}
                        </button>

                        {route && bestHarbour && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4 pt-4 border-t border-white/10"
                            >
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <DollarSign className="w-24 h-24 text-green-400" />
                                    </div>
                                    <p className="text-green-300 text-xs font-bold uppercase tracking-wider mb-1">
                                        {tripDirection === 'outbound' ? t('departure_harbour') : t('recommended_destination')}
                                    </p>
                                    <h3 className="text-2xl font-bold text-white mb-2">{bestHarbour.name}</h3>

                                    {tripDirection === 'inbound' && (
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-gray-400 text-xs">{t('selling_price')}</p>
                                                <p className="text-green-400 font-bold">₹{bestHarbour.marketPrice?.toFixed(0) || 0}/kg</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-400 text-xs">{t('net_profit')}</p>
                                                <p className="text-2xl font-bold text-white">₹{bestHarbour.netProfit?.toLocaleString() || 0}</p>
                                            </div>
                                        </div>
                                    )}

                                    {tripDirection === 'outbound' && (
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-gray-400 text-xs">{t('distance_to_zone')}</p>
                                                <p className="text-aqua font-bold">{bestHarbour.distance?.toFixed(1)} {t('km')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-400 text-xs">{t('est_arrival')}</p>
                                                <p className="text-white font-bold">{route.time}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-green-500/20 text-xs text-green-200/80">
                                        {route.comparison}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-center">
                                        <Fuel className="w-5 h-5 text-aqua mx-auto mb-1" />
                                        <p className="text-xs text-gray-400">{t('fuel_cost')}</p>
                                        <p className="font-bold text-white">₹{bestHarbour.fuelCost.toFixed(0)}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg text-center">
                                        <div className="text-aqua text-center font-bold mb-1 w-5 h-5 mx-auto">⏳</div>
                                        <p className="text-xs text-gray-400">{t('travel_time')}</p>
                                        <p className="font-bold text-white">{route.time}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Map Display / Compass Display */}
                <div className="flex-1 glass-panel border-white/5 rounded-[40px] overflow-hidden relative min-h-[500px] z-10 shadow-2xl">
                    {/* View Toggle */}
                    <div className="absolute top-6 right-6 z-[1000] flex bg-[#020617]/80 backdrop-blur-xl p-1 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-[#020617] shadow-xl' : 'text-gray-500 hover:text-white'}`}
                        >
                            <MapIcon className="w-3.5 h-3.5" />
                            {t('tactical_map')}
                        </button>
                        <button
                            onClick={() => setViewMode('compass')}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'compass' ? 'bg-aqua-glow text-[#020617] shadow-xl' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Compass className="w-3.5 h-3.5" />
                            {t('sentinel')}
                        </button>
                    </div>

                    {viewMode === 'map' ? (
                        <MapContainer center={[19.0, 72.8]} zoom={9} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={zoneCoords}>
                                <Popup>
                                    <div className="text-center">
                                        <b>{locationName}</b>
                                        <button
                                            onClick={() => navigate('/weather', { state: { name: locationName, coords: zoneCoords } })}
                                            className="block mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded w-full hover:bg-blue-600"
                                        >
                                            {t('check_weather')} ☁️
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>

                            {indianHarbours.map((h, idx) => (
                                <Marker key={idx} position={h.coords} opacity={bestHarbour && bestHarbour.name === h.name ? 1 : 0.6}>
                                    <Popup>
                                        <b>{h.name}</b><br />
                                        {t('price')}: ₹{(marketPricesBase[selectedSpecies] * h.priceMod).toFixed(0)}/kg
                                        <button
                                            onClick={() => navigate('/weather', { state: { name: h.name, coords: h.coords } })}
                                            className="block mt-2 text-xs bg-ocean text-white px-2 py-1 rounded w-full hover:bg-aqua hover:text-ocean"
                                        >
                                            {t('harbour_weather')} ☁️
                                        </button>
                                    </Popup>
                                </Marker>
                            ))}

                            {route && <Polyline positions={route.path} color="#00B4D8" weight={4} dashArray="10, 10" />}
                            {bestHarbour && <MapUpdater center={bestHarbour.coords} zoom={10} />}
                        </MapContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center p-6 bg-ocean">
                            <SentinelCompass
                                targetCoords={bestHarbour?.coords || zoneCoords}
                                targetName={bestHarbour?.name || locationName}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteOptimization;
