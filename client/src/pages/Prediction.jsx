import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Info, Navigation, Activity, Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BioScanner from '../components/BioScanner';
import { getFishZones, syncAllData } from '../services/offlineService';
import { indianFishZones } from '../data/fishZones';
import { majorIndianPorts } from '../data/ports';

// Component to update map center when coordinates change
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
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

const Prediction = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [center, setCenter] = useState([20.5937, 78.9629]); // Default to Center of India
    const [zoom, setZoom] = useState(5); // Default zoom for India view
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBioScan, setShowBioScan] = useState(false);

    // Filters
    const [selectedSpecies, setSelectedSpecies] = useState('All');
    const [boatType, setBoatType] = useState('All');

    // Filter Logic
    const displayedZones = zones.filter(zone => {
        // 1. Filter by Boat Type
        if (boatType === 'Small') {
            // If backend provides suitableFor, use it. Otherwise fallback to Nearshore check
            if (zone.suitableFor) {
                if (!zone.suitableFor.includes('small')) return false;
            } else if (zone.type !== 'Nearshore') {
                return false;
            }
        } else if (boatType === 'Big') {
            if (zone.suitableFor) {
                if (!zone.suitableFor.includes('big')) return false;
            } else if (zone.type === 'Nearshore') {
                // Big boats can go to nearshore too, but usually prefer deep sea
                // No strict exclusion here unless specified
            }
        }

        // 2. Filter by Species
        if (selectedSpecies !== 'All' && !zone.species.some(s => s.toLowerCase().includes(selectedSpecies.toLowerCase()))) return false;

        return true;
    });

    useEffect(() => {
        const loadData = async (coords = null) => {
            setLoading(true);
            try {
                // Get User Profile for fallback coordinates
                const storedUser = localStorage.getItem('user');
                const user = storedUser ? JSON.parse(storedUser) : null;

                // 1. Try to load from local storage first (Offline first)
                const offlineZones = getFishZones();

                // Merge Logic: Always include the Global Harbors (indianFishZones)
                // Plus the dynamic hotspots (offlineZones or freshData)
                const mergeData = (dynamicData) => {
                    const hotspotData = dynamicData || [];
                    return [...indianFishZones, ...hotspotData];
                };

                if (offlineZones && offlineZones.length > 0) {
                    console.log('Loaded zones from offline storage:', offlineZones.length);
                    setZones(mergeData(offlineZones));
                } else {
                    // Fallback to static data if nothing in valid storage
                    console.log('No offline data found, using static fallback.');
                    setZones(indianFishZones);
                }

                // 2. Try to refresh data from server (Background sync)
                if (navigator.onLine) {
                    // Pass current GPS coords if available, otherwise use profile
                    const finalCoords = coords || {
                        lat: user?.lat || 18.975,
                        lng: user?.lng || 72.825
                    };

                    await syncAllData(finalCoords);

                    const freshData = getFishZones();
                    if (freshData && freshData.length > 0) {
                        setZones(mergeData(freshData));
                    }
                }
            } catch (error) {
                console.error("Sync error", error);
            } finally {
                setLoading(false);
            }
        };

        // Initial load with profile data
        loadData();

        // Auto-center map based on user location
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user && user.location) {
            const port = majorIndianPorts.find(p => p.name === user.location);
            if (port && port.coords) {
                setCenter(port.coords);
                setZoom(10); // Closer look at their home port
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-aqua-glow/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
                <header className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                            {t('catch')} <span className="text-aqua-glow font-bold shadow-aqua-glow/20">{t('intelligence')}</span>
                        </h1>
                        <p className="text-blue-300/80 text-sm font-medium tracking-wide flex items-center gap-2 mt-1">
                            <Info className="w-3.5 h-3.5 text-aqua-glow" />
                            {t('ai_heatmap_desc')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowBioScan(!showBioScan)}
                        className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all ${showBioScan ? 'bg-emerald-500 text-white' : 'glass-panel border-white/10 text-gray-400'}`}
                    >
                        <Activity className={`w-3 h-3 ${showBioScan ? 'animate-pulse' : ''}`} /> {showBioScan ? t('active') : t('bio_scan')}
                    </button>
                </header>

                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" /> {t('system_ready')}</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-aqua-glow shadow-[0_0_8px_#0ea5e9]" /> {displayedZones?.length || 0} {t('sectors_profiled')}</span>
                </div>
            </div>

            <div className="flex-1 glass-panel border-white/5 rounded-[40px] overflow-hidden relative h-[75vh] min-h-[500px] z-10 shadow-2xl">
                {/* Filter Bar */}
                <div className="absolute top-6 left-6 z-[1000] glass-panel border-white/20 bg-[#020617]/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl flex flex-col gap-8 w-72">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-aqua-glow rounded-full shadow-[0_0_15px_#0ea5e9]" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">{t('tactical_filters')}</h2>
                    </div>

                    {/* Vessel Size Filter */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-2 block">{t('vessel_category')}</label>
                        <div className="grid grid-cols-1 gap-2 bg-blue-900/40 rounded-3xl p-2 border border-white/5">
                            <button
                                onClick={() => setBoatType('All')}
                                className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${boatType === 'All' ? 'bg-white shadow-xl text-[#020617]' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
                            >
                                {t('universal')}
                            </button>
                            <button
                                onClick={() => setBoatType('Small')}
                                className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${boatType === 'Small' ? 'bg-blue-600 shadow-xl text-white' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
                            >
                                {t('nearshore')}
                            </button>
                            <button
                                onClick={() => setBoatType('Big')}
                                className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${boatType === 'Big' ? 'bg-aqua-glow shadow-xl text-[#020617]' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
                            >
                                {t('deep_sea')}
                            </button>
                        </div>
                    </div>

                    {/* Species Filter */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-2 block">{t('target_intelligence')}</label>
                        <select
                            value={selectedSpecies}
                            onChange={(e) => setSelectedSpecies(e.target.value)}
                            className="w-full bg-blue-900/40 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white p-4 focus:border-aqua-glow outline-none appearance-none cursor-pointer hover:bg-blue-900/60 transition-all [&>option]:bg-[#020617]"
                        >
                            <option value="All">{t('all_species_profiles')}</option>
                            <option value="Pomfret">Pomfret</option>
                            <option value="Mackerel">Mackerel</option>
                            <option value="Prawns">Prawns</option>
                            <option value="Tuna">Tuna</option>
                            <option value="Sardines">Sardines</option>
                            <option value="Hilsa">Hilsa</option>
                        </select>
                    </div>

                    {/* Bio-Scan Toggle */}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={() => setShowBioScan(!showBioScan)}
                            className={`w-full py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${showBioScan ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-blue-900/40 border border-aqua-glow/30 text-aqua-glow hover:bg-aqua-glow hover:text-black'}`}
                        >
                            <Activity className={`w-4 h-4 ${showBioScan ? 'animate-pulse' : ''}`} />
                            {showBioScan ? t('scanner_live') : t('initiate_scan')}
                        </button>
                    </div>
                </div>

                <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
                    <MapUpdater center={center} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <BioScanner zones={displayedZones} enabled={showBioScan} />
                    {displayedZones.map((zone) => (
                        <Circle
                            key={zone.id}
                            center={[zone.lat, zone.lng]}
                            radius={zone.radius}
                            pathOptions={{
                                color: zone.confidence > 90 ? '#00E5FF' : (zone.confidence > 70 ? '#FFD600' : '#FF3B3B'),
                                fillColor: zone.confidence > 90 ? '#00E5FF' : (zone.confidence > 70 ? '#FFD600' : '#FF3B3B'),
                                fillOpacity: 0.2,
                                weight: 2
                            }}
                        >
                            <Popup className="premium-popup">
                                <div className="p-2 w-52 bg-[#020617] text-white">
                                    <h3 className="font-black uppercase tracking-widest text-[#00E5FF] text-[10px] mb-2 italic">{zone.type} {t('details')}</h3>
                                    <div className="w-full h-24 bg-white/5 rounded-2xl mb-3 flex items-center justify-center overflow-hidden border border-white/5">
                                        <img
                                            src={getFishImage(zone.species[0])}
                                            alt={zone.species[0]}
                                            className="w-full h-full object-contain p-4 opacity-80"
                                        />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-tight text-white mb-2">{zone.locationName}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{t('target_species')}: <span className="text-white">{zone.species[0]}</span></p>
                                        {zone.sst && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-black border border-blue-500/20 uppercase tracking-widest">{zone.sst}</span>}
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-1.5 h-1.5 rounded-full ${zone.confidence > 90 ? 'bg-aqua-glow' : 'bg-yellow-500'} animate-pulse`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">{zone.confidence}% {t('prediction_accuracy')}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate('/route', { state: { zone: zone } })}
                                            className="flex-1 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-aqua-glow text-white px-3 py-2.5 rounded-xl hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            {t('intercept')} ➔
                                        </button>
                                        <button
                                            onClick={() => navigate('/weather', { state: { name: zone.locationName, coords: [zone.lat, zone.lng] } })}
                                            className="w-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs"
                                            title={t('environmental_intel')}
                                        >
                                            ☁️
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>

                {/* Overlay Legend */}
                <div className="absolute top-6 right-6 glass-panel border-white/20 bg-blue-900/40 text-white p-5 rounded-[32px] shadow-2xl z-[1000] min-w-[180px]">
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-aqua-glow mb-4 italic">{t('intel_legend')}</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-aqua-glow shadow-lg shadow-aqua-glow/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t('prime_sector')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t('med_visibility')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t('low_intel')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
