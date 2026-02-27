import React, { useState } from 'react';
import { AlertTriangle, Fish, Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const AlertButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReport = async (type) => {
        setLoading(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await api.post('/alerts', {
                    type,
                    location: { lat: latitude, lng: longitude },
                    message: type === 'sos' ? 'EMERGENCY: SOS Signal Sent' : 'Significant Fish Population Spotted'
                });

                if (response.status === 200 || response.status === 201) {
                    setSent(true);
                } else {
                    throw new Error("Server reporting failed");
                }
            } catch (error) {
                console.warn("Reporting failed, saving offline:", error);
                const { queueOfflineAlert } = await import('../services/offlineService');
                queueOfflineAlert({
                    type,
                    location: { lat: latitude, lng: longitude },
                    message: type === 'sos' ? 'EMERGENCY: SOS Signal Sent (Offline)' : 'Significant Fish Population Spotted (Offline)'
                });
                setSent(true); // Still show success but marked as offline
            } finally {
                setTimeout(() => {
                    setSent(false);
                    setIsOpen(false);
                }, 3000);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error getting location:", error);
            setLoading(false);
            alert("Please enable location services to send alerts.");
        });
    };

    return (
        <div className="fixed bottom-24 right-28 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-3xl mb-4 w-72 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">Signal Alert</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {sent ? (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Send className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-green-500 font-medium">Alert Dispatched!</p>
                                <p className="text-gray-400 text-xs mt-1">Nearby vessels will be notified.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleReport('fish')}
                                    disabled={loading}
                                    className="w-full flex items-center gap-3 bg-aqua/20 hover:bg-aqua/30 text-aqua p-4 rounded-2xl border border-aqua/30 transition-all group"
                                >
                                    <div className="bg-aqua/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <Fish className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-sm">Report Fish</div>
                                        <div className="text-[10px] text-aqua/70">Share high yield zone</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleReport('sos')}
                                    disabled={loading}
                                    className="w-full flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 text-red-500 p-4 rounded-2xl border border-red-500/30 transition-all group"
                                >
                                    <div className="bg-red-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-sm text-red-400">Emergency SOS</div>
                                        <div className="text-[10px] text-red-400/70">Broadcast distress signal</div>
                                    </div>
                                </button>

                                {loading && (
                                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Getting location...
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg border backdrop-blur-md transition-colors ${isOpen ? 'bg-white text-black border-white' : 'bg-aqua text-white border-aqua/50'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Send className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default AlertButton;
