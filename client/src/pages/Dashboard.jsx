import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Map,
    Wind,
    Anchor,
    Droplets,
    TrendingUp,
    AlertCircle,
    Activity,
    Download,
    Loader2,
    Volume2,
    VolumeX,
    Globe,
    User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SOSButton from '../components/SOSButton';
import AlertButton from '../components/AlertButton';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { syncAllData, getWeather, getSeasonalData, getLastSyncTime } from '../services/offlineService';
import OfflineSOS from '../components/OfflineSOS';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { t } = useTranslation();
    const [isSyncing, setIsSyncing] = useState(false);
    const [weather, setWeather] = useState(null);
    const [seasonal, setSeasonal] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [user, setUser] = useState(null);
    const [lastSync, setLastSync] = useState(null);

    // Load offline data on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const loadOfflineData = () => {
            const weatherData = getWeather();
            const seasonalData = getSeasonalData();
            const syncTime = getLastSyncTime();

            if (weatherData) setWeather(weatherData);
            if (seasonalData) setSeasonal(seasonalData);
            if (syncTime) setLastSync(new Date(syncTime).toLocaleString());
        };

        loadOfflineData();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Pass user coordinates to ensure regional data is fetched
            const coords = user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : null;
            const success = await syncAllData(coords);
            if (success) {
                // Refresh local state with new data
                setWeather(getWeather());
                setSeasonal(getSeasonalData());
                setLastSync(new Date().toLocaleString());
                alert(`Data Synced Successfully! All zones updated and available offline.`);
            } else {
                alert('Sync failed. Please check your connection.');
            }
        } catch (error) {
            console.error('Sync error:', error);
            alert('An error occurred during sync.');
        } finally {
            setIsSyncing(false);
        }
    };

    const fuelData = {
        labels: [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')],
        datasets: [
            {
                label: `${t('fuel_saved')} (L)`,
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: '#00B4D8',
                backgroundColor: 'rgba(0, 180, 216, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#9CA3AF' }
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 pb-32 space-y-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aqua-glow/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-6">
                <SOSButton isMuted={isMuted} />

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase italic">
                            {t('fleet_command')}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            {t('welcome')}, <span className="text-white">{user?.name || t('captain')}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        {lastSync && (
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('intel_sync')}</span>
                                <span className="text-[10px] font-black text-aqua-glow uppercase tracking-wider">{lastSync}</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="px-3 py-1.5 glass-panel rounded-xl flex items-center gap-2 text-gray-400 hover:text-white transition-all border-white/10"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-aqua" />}
                            <span className="text-[10px] font-bold uppercase tracking-wider">{isMuted ? t('muted') : t('voice_on')}</span>
                        </button>
                        <div className="px-4 py-2 glass-panel rounded-xl flex items-center gap-2 border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('system_online')} <span className="text-green-500">{t('online')}</span></span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Droplets className="w-6 h-6 text-aqua" />}
                        label={t('fuel_saved')}
                        value="1,240 L"
                        trend="+12%"
                        trendUp={true}
                    />
                    <StatCard
                        icon={<Map className="w-6 h-6 text-purple-400" />}
                        label={t('fish_zones')}
                        value={seasonal?.riskLevel ? `${t(seasonal.riskLevel.toLowerCase())} ${t('caution')}` : "N/A"}
                        subtext={seasonal?.season ? `${t(seasonal.season.toLowerCase())}` : t('syncing')}
                    />
                    <StatCard
                        icon={<Wind className="w-6 h-6 text-yellow-400" />}
                        label={t('weather_forecast')}
                        value={weather?.riskLevel ? t(weather.riskLevel.toLowerCase()) : t('clear')}
                        subtext={weather?.location || t('syncing')}
                    />
                    <StatCard
                        icon={<Anchor className="w-6 h-6 text-green-400" />}
                        label={t('active_users')}
                        value="2"
                        subtext={t('active')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-aqua-glow/10 blur-3xl rounded-full" />
                        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp className="w-4 h-4 text-aqua-glow" />
                            {t('efficiency_trends')}
                        </h3>
                        <Line data={fuelData} options={chartOptions} />
                    </div>

                    <div className="space-y-6">
                        <OfflineSOS />

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-3xl border-white/5">
                                <h3 className="text-base font-black text-white mb-4 uppercase tracking-tight italic">{t('quick_actions')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <QuickActionBtn to="/prediction" label={t('prediction')} icon={<Map className="w-4 h-4" />} />
                                    <QuickActionBtn to="/neptune" label="NEPTUNE CORE" icon={<Activity className="w-4 h-4 text-aqua-glow animate-pulse" />} />
                                    <QuickActionBtn to="/route" label={t('set_route')} icon={<Anchor className="w-4 h-4" />} />
                                    <QuickActionBtn to="/weather" label={t('weather')} icon={<Wind className="w-4 h-4" />} />
                                    <QuickActionBtn to="/market" label={t('market')} icon={<TrendingUp className="w-4 h-4" />} />
                                    <QuickActionBtn to="/profile" label={t('profile')} icon={<User className="w-4 h-4" />} />
                                    <QuickActionBtn to="/global-view" label={t('map_view')} icon={<Globe className="w-4 h-4" />} />
                                    <button
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className="w-full p-3 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group disabled:opacity-50"
                                    >
                                        <div className={`text-emerald-400 group-hover:scale-110 transition-transform ${isSyncing ? 'animate-spin' : ''}`}>
                                            {isSyncing ? <Loader2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981]">
                                            {isSyncing ? t('syncing') : t('sync')}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="glass-panel p-5 rounded-3xl border-white/5">
                                <h3 className="text-base font-black text-white mb-3 flex items-center gap-2 uppercase tracking-tight italic">
                                    {t('recent_alerts')}
                                </h3>
                                <div className="space-y-4">
                                    {weather?.forecast?.map((day, index) => (
                                        day.condition === 'High Wind' && (
                                            <div key={index} className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg flex gap-3">
                                                <Wind className="w-5 h-5 text-red-400 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-red-200">{t('high_wind_warning')}</p>
                                                    <p className="text-xs text-red-300/60">{day.day} - {day.wind} {t('knots')}</p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                    {(!weather || !weather.forecast?.some(d => d.condition === 'High Wind')) && (
                                        <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex gap-3">
                                            <Droplets className="w-5 h-5 text-yellow-400 shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-yellow-200">{t('fuel_low')}</p>
                                                <p className="text-xs text-yellow-300/60">{t('vessel')} B - 15% remaining</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AlertButton />
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, trendUp, subtext }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden group min-h-[120px] flex flex-col justify-between"
    >
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-aqua-glow/20 transition-colors">{icon}</div>
            {trend && (
                <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend}
                </div>
            )}
        </div>
        <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">{label}</h4>
        <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white">{value}</span>
            {subtext && <span className="text-[9px] font-medium text-gray-600 uppercase">{subtext}</span>}
        </div>
    </motion.div>
);

const QuickActionBtn = ({ to, label, icon }) => (
    <Link to={to} className="w-full">
        <button className="w-full p-3 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-aqua-glow/10 hover:border-aqua-glow/30 transition-all group">
            <div className="text-gray-500 group-hover:text-aqua-glow transition-all group-hover:scale-110">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{label}</span>
        </button>
    </Link>
);

export default Dashboard;
