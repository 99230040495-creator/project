import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloudRain, Wind, Thermometer, AlertOctagon, Navigation, Sun, Cloud, CloudLightning } from 'lucide-react';
import { majorIndianPorts } from '../data/ports';

const Weather = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get location from navigation state, user profile, or default to first port
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Resolve location and coordinates with priority:
    // 1. Navigation state (contains name and coords)
    // 2. User's saved location in profile (matched against ports list)
    // 3. Default to first port
    
    let targetLocation = "";
    let targetCoords = [18.975, 72.825]; // Default fallback

    if (location.state?.coords) {
        targetLocation = location.state.name;
        targetCoords = location.state.coords;
    } else {
        const locationToFind = (storedUser.location || majorIndianPorts[0].name).trim().toLowerCase();
        const portData = majorIndianPorts.find(p => p.name.trim().toLowerCase() === locationToFind) || 
                         majorIndianPorts.find(p => p.name.toLowerCase().includes(locationToFind)) ||
                         majorIndianPorts[0];
        targetLocation = portData.name;
        targetCoords = portData.coords;
    }

    useEffect(() => {
        // Simulate fetching unique weather for this location
        const generateWeather = () => {
            setLoading(true);
            setTimeout(() => {
                // Pseudo-random generation based on name length to keep it consistent-ish for demo
                const seed = targetLocation.length;
                const isRainy = seed % 3 === 0;
                const temp = 26 + (seed % 5);

                setWeatherData({
                    temp: temp,
                    condition: isRainy ? 'Light Rain' : (seed % 2 === 0 ? 'Sunny' : 'Cloudy'),
                    windSpeed: 10 + (seed % 15),
                    waveHeight: 0.5 + (seed % 20) / 10,
                    humidity: 70 + (seed % 20),
                    pressure: 1010 + (seed % 5),
                    visibility: 8 + (seed % 5),
                    risk: (seed % 4 === 0) ? 'Moderate' : 'Low'
                });
                setLoading(false);
            }, 800);
        };

        generateWeather();
    }, [targetLocation]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6">
                <div className="w-12 h-12 border-4 border-aqua-glow/20 border-t-aqua-glow rounded-full animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">{t('initializing_weather')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                    {t('marine')} <span className="text-aqua-glow">{t('meteorology')}</span>
                </h1>
                <p className="text-gray-500 text-sm font-medium tracking-wide">
                    {t('real_time_weather')} <span className="text-aqua-glow font-bold italic">{targetLocation}</span>.
                </p>
            </header>

            {/* Current Conditions */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <WeatherCard
                    title={t('wind_speed')}
                    value={`${weatherData.windSpeed} ${t('knots')}`}
                    status={weatherData.windSpeed > 20 ? t('high') : t('moderate')}
                    icon={<Wind className="w-6 h-6 text-aqua-glow" />}
                    color="text-aqua-glow"
                />
                <WeatherCard
                    title={t('wave_height')}
                    value={`${weatherData.waveHeight} ${t('meters')}`}
                    status={weatherData.waveHeight > 2 ? t('rough') : t('safe')}
                    icon={<Navigation className="w-6 h-6 text-blue-400 rotate-45" />}
                    color="text-blue-400"
                />
                <WeatherCard
                    title={t('visibility')}
                    value={`${weatherData.visibility} ${t('km')}`}
                    status={weatherData.visibility < 5 ? t('low') : t('clear')}
                    icon={<AlertOctagon className="w-6 h-6 text-[#10b981]" />}
                    color="text-[#10b981]"
                />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aqua-glow/30 to-transparent" />
                    <div className="text-center md:text-left relative z-10">
                        <div className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-1 text-glow-aqua">{weatherData.temp}°C</div>
                        <p className="text-xl text-gray-300 flex items-center gap-2 justify-center md:justify-start">
                            {weatherData.condition === 'Sunny' ? <Sun className="w-6 h-6 text-yellow-400" /> :
                                weatherData.condition === 'Rain' ? <CloudRain className="w-6 h-6 text-blue-400" /> :
                                    <Cloud className="w-6 h-6 text-gray-400" />}
                            {t(weatherData.condition.toLowerCase().replace(' ', '_'))}
                        </p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{targetLocation} • {t('live_feed')}</p>
                    </div>
                    <div className="flex-1 w-full grid grid-cols-2 gap-3 relative z-10">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('humidity')}</p>
                            <p className="text-lg font-black text-white">{weatherData.humidity}%</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('pressure')}</p>
                            <p className="text-lg font-black text-white">{weatherData.pressure} {t('hpa')}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('sea_temp')}</p>
                            <p className="text-lg font-black text-white">{weatherData.temp - 2}°C</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('risk_level')}</p>
                            <p className={`text-lg font-black uppercase ${weatherData.risk.toLowerCase() === 'high' ? 'text-rose-500' : 'text-[#10b981]'}`}>
                                {t(weatherData.risk.toLowerCase())}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Forecast */}
                <div className="glass-panel border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight italic">{t('five_day')} <span className="text-aqua-glow">{t('forecast')}</span></h3>
                    <div className="space-y-4">
                        <ForecastRow day={t('tomorrow')} temp={`${weatherData.temp + 1}°C`} wind={`10 ${t('knots')}`} condition={t('sunny')} />
                        <ForecastRow day={t('wed')} temp={`${weatherData.temp - 1}°C`} wind={`15 ${t('knots')}`} condition={t('cloudy')} />
                        <ForecastRow day={t('thu')} temp={`${weatherData.temp}°C`} wind={`22 ${t('knots')}`} condition={t('high_wind')} alert />
                        <ForecastRow day={t('fri')} temp={`${weatherData.temp - 2}°C`} wind={`12 ${t('knots')}`} condition={t('rain')} />
                        <ForecastRow day={t('sat')} temp={`${weatherData.temp + 2}°C`} wind={`8 ${t('knots')}`} condition={t('clear')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const WeatherCard = ({ title, value, status, icon, color }) => (
    <div className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between group">
        <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
            <span className={`text-[10px] font-black uppercase tracking-wider ${color}`}>{status}</span>
        </div>
        <div className="p-2.5 bg-white/5 rounded-xl ring-1 ring-white/10 group-hover:bg-aqua-glow/20 transition-all duration-500">
            {icon}
        </div>
    </div>
);

const ForecastRow = ({ day, temp, wind, condition, alert }) => (
    <div className={`flex items-center justify-between p-3 rounded-2xl transition-all ${alert ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
        <span className="w-16 text-xs font-black uppercase tracking-widest text-white">{day}</span>
        <span className="text-gray-400 text-xs font-bold flex items-center gap-2">
            <Thermometer className="w-3.5 h-3.5" /> {temp}
        </span>
        <span className="text-gray-400 text-xs font-bold flex items-center gap-2">
            <Wind className="w-3.5 h-3.5" /> {wind}
        </span>
        <span className={`w-24 text-right text-[10px] font-black uppercase tracking-widest ${alert ? 'text-rose-500' : 'text-aqua-glow'}`}>
            {condition}
        </span>
    </div>
);

export default Weather;
