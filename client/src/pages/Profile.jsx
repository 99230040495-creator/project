
import { useState, useEffect } from 'react';
import { User, Ship, Settings, LogOut, Globe, Mail, MapPin, Database, Trash2, Lock, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../services/api';
import { majorIndianPorts } from '../data/ports';
import { useAuth } from '../context/AuthContext';

const OfflineDataSection = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        zones: 0,
        weather: false,
        lastSync: null
    });

    const checkStorage = () => {
        const zones = localStorage.getItem('offline_fish_zones');
        const weather = localStorage.getItem('offline_weather');
        const lastSync = localStorage.getItem('offline_last_sync');

        setStats({
            zones: zones ? JSON.parse(zones).length : 0,
            weather: !!weather,
            lastSync: lastSync ? new Date(lastSync).toLocaleString() : 'Never'
        });
    };

    useEffect(() => {
        checkStorage();
        // Poll for updates every 5s in case sync happens in background
        const interval = setInterval(checkStorage, 5000);
        return () => clearInterval(interval);
    }, []);

    const clearCache = () => {
        if (window.confirm('Are you sure you want to delete all offline data? You will need internet to fetch it again.')) {
            localStorage.removeItem('offline_fish_zones');
            localStorage.removeItem('offline_weather');
            localStorage.removeItem('offline_seasonal_data');
            localStorage.removeItem('offline_catch_history');
            localStorage.removeItem('offline_last_sync');
            checkStorage();
            alert('Offline cache cleared.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel border-white/5 rounded-[32px] p-8"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight italic">
                    <Database className="w-5 h-5 text-aqua-glow" /> {t('offline_data')}
                </h3>
                <button
                    onClick={clearCache}
                    className="text-rose-500 text-[10px] font-black tracking-widest uppercase hover:text-rose-400 flex items-center gap-1 border border-rose-500/20 px-3 py-1.5 rounded-xl hover:bg-rose-500/5 transition-all"
                >
                    <Trash2 className="w-3 h-3" /> {t('clear_cache')}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-blue-900/20 p-4 rounded-2xl border border-white/10">
                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">{t('last_sync')}</p>
                    <p className="text-white font-mono text-xs">{stats.lastSync}</p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-2xl border border-white/10">
                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">{t('zones_cached')}</p>
                    <p className="text-aqua-glow font-black text-lg">{stats.zones} <span className="text-[10px] uppercase font-bold text-blue-200/50">{t('zones')}</span></p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-2xl border border-white/10">
                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">{t('weather_data')}</p>
                    <p className={stats.weather ? "text-emerald-400 font-black text-sm uppercase tracking-widest" : "text-blue-200 font-bold text-sm uppercase tracking-widest"}>
                        {stats.weather ? t('available') : t('not_cached')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const ChangePasswordSection = () => {
    const { t } = useTranslation();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel border-white/5 rounded-[32px] p-8"
        >
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tight italic">
                <Lock className="w-5 h-5 text-aqua-glow" /> {t('change_password')}
            </h3>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {message.type === 'success' ? '✓ ' : '⚠ '}{message.text}
                </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('current_password')}</label>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            className="w-full p-3 bg-white/5 border border-white/5 rounded-2xl focus:border-aqua-glow/30 outline-none text-white text-sm font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('new_password')}</label>
                        <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="w-full p-3 bg-white/5 border border-white/5 rounded-2xl focus:border-aqua-glow/30 outline-none text-white text-sm font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('confirm_new_password')}</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full p-3 bg-white/5 border border-white/5 rounded-2xl focus:border-aqua-glow/30 outline-none text-white text-sm font-bold"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 hover:border-aqua-glow/50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all disabled:opacity-50"
                    >
                        {loading ? t('processing') : t('update_password')}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const Profile = () => {
    const { t } = useTranslation();
    const { updateProfile: contextUpdateProfile } = useAuth();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        location: '', // Assuming 'location' from original code maps to this
        language: 'English',
        boatName: '',
        boatType: 'small-vessel',
        homePort: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                if (response.data) {
                    setUser(prevUser => ({
                        ...prevUser,
                        ...response.data
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                if (error.response?.status === 401 || error.response?.status === 404) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login?msg=session_expired';
                    return;
                }
                // Fallback to localStorage if API fails for other reasons
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(prevUser => ({
                        ...prevUser,
                        ...JSON.parse(storedUser)
                    }));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await contextUpdateProfile(user);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.response?.status === 401 || error.response?.status === 404) {
                alert('Your session has expired. Please log in again.');
                window.location.href = '/login';
                return;
            }
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6">
                <div className="w-12 h-12 border-4 border-aqua-glow/20 border-t-aqua-glow rounded-full animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">{t('processing')}</p>
            </div>
        );
    }

    if (!user.email) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6">
                <div className="glass-panel p-8 rounded-[40px] text-center max-w-sm border-white/10">
                    <LogIn className="w-12 h-12 text-aqua-glow mx-auto mb-4" />
                    <h2 className="text-xl font-black uppercase tracking-tight mb-2 italic">{t('access')} <span className="text-aqua-glow">{t('denied')}</span></h2>
                    <p className="text-gray-500 text-sm mb-6 font-medium">{t('connection_required_profile')}</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl text-white font-black uppercase tracking-widest text-sm"
                    >
                        {t('login')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl mx-auto relative z-10 space-y-6">
                <header>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                        {t('user')} <span className="text-aqua-glow">{t('profile')}</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                        {t('manage_account')} {t('protocol_activated')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="glass-panel border-white/5 rounded-[32px] p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-aqua-glow rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20 rotate-3">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{user.name || 'User'}</h2>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{t('professional_fisherman')}</p>
                            <div className="flex justify-center">
                                <span className="px-3 py-1 bg-aqua-glow/10 text-aqua-glow rounded-full text-[10px] font-black tracking-widest uppercase border border-aqua-glow/20">
                                    {t('pro_member')}
                                </span>
                            </div>
                        </div>

                        <div className="glass-panel border-white/5 rounded-[32px] overflow-hidden">
                            <button className="w-full p-4 flex items-center gap-3 text-gray-400 hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border-b border-white/5">
                                <Settings className="w-4 h-4 text-aqua-glow" /> {t('account_settings')}
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="w-full p-4 flex items-center gap-3 text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4" /> {t('sign_out')}
                            </button>
                        </div>
                    </div>

                    {/* Details Form Area */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel border-white/5 rounded-[32px] p-8"
                        >
                            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tight italic">
                                <User className="w-5 h-5 text-aqua-glow" /> {t('personal_info')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('full_name')}</label>
                                    <div className="flex items-center gap-3 p-3 py-3.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-aqua-glow/30 transition-all">
                                        <User className="w-4 h-4 text-gray-600" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={user.name || ''}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none text-sm font-bold placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('email')}</label>
                                    <div className="flex items-center gap-3 p-3 py-3.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-aqua-glow/30 transition-all">
                                        <Mail className="w-4 h-4 text-gray-600" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email || ''}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none text-sm font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('home_port')}</label>
                                    <div className="flex items-center gap-3 p-3 py-3.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-aqua-glow/30 transition-all">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <select
                                            name="location"
                                            value={user.location || majorIndianPorts[0].name}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none text-sm font-bold [&>option]:bg-[#020617]"
                                        >
                                            {majorIndianPorts.map(port => (
                                                <option key={port.name} value={port.name}>
                                                    {port.name} ({port.state})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('language')}</label>
                                    <div className="flex items-center gap-3 p-3 py-3.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-aqua-glow/30 transition-all">
                                        <Globe className="w-4 h-4 text-gray-600" />
                                        <select
                                            name="language"
                                            value={user.language || 'English'}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none text-sm font-bold [&>option]:bg-[#020617]"
                                        >
                                            <option>English</option>
                                            <option>Hindi</option>
                                            <option>Malayalam</option>
                                            <option>Tamil</option>
                                            <option>Telugu</option>
                                            <option>Marathi</option>
                                            <option>Bengali</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Boat Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel border-white/5 rounded-[32px] p-8"
                        >
                            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tight italic">
                                <Ship className="w-5 h-5 text-aqua-glow" /> {t('boat_details')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('boat_type')}</label>
                                    <div className="flex items-center gap-3 p-3 py-3.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-aqua-glow/30 transition-all">
                                        <Ship className="w-4 h-4 text-gray-600" />
                                        <select
                                            name="boatType"
                                            value={user.boatType || 'small-vessel'}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none text-sm font-bold [&>option]:bg-[#020617]"
                                        >
                                            <option value="small-vessel">{t('small_boat')}</option>
                                            <option value="trawler">{t('trawler')}</option>
                                            <option value="seiner">{t('seiner')}</option>
                                            <option value="drifter">{t('drifter')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Change Password Section */}
                        <ChangePasswordSection />

                        {/* Offline Data Management */}
                        <OfflineDataSection />

                        <div className="flex justify-end gap-3 pt-4">
                            <button className="px-8 py-3.5 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all"
                            >
                                {t('save_changes')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
