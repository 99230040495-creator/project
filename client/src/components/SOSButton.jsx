import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, Loader2, Navigation, Anchor } from 'lucide-react';

const SOSButton = ({ isMuted }) => {
    const [status, setStatus] = useState('idle'); // idle, pressing, sent
    const [progress, setProgress] = useState(0);
    const pressInterval = useRef(null);
    const [location, setLocation] = useState(null);

    // Voice Assistant Helper
    const speak = (text) => {
        if (!isMuted && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1; // Slightly faster for urgency
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startPress = () => {
        if (status === 'sent') return;
        setStatus('pressing');
        let p = 0;
        pressInterval.current = setInterval(() => {
            p += 2; // 50ms * 50 = 2500ms press time
            setProgress(p);
            if (p >= 100) {
                triggerSOS();
                clearInterval(pressInterval.current);
            }
        }, 30);
    };

    const endPress = () => {
        if (status === 'sent') return;
        clearInterval(pressInterval.current);
        setStatus('idle');
        setProgress(0);
    };

    const triggerSOS = () => {
        setStatus('sent');
        setProgress(100);

        // Get Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setLocation({ lat: 18.96, lng: 72.82 }) // Default fallback
            );
        }

        speak("Mayday. Mayday. Mayday. Distress signal sent. Transmitting coordinates to Coast Guard and nearby vessels.");

        // Simulate backend response
        setTimeout(() => {
            speak("Rescue team acknowledged. ETA 15 minutes.");
        }, 5000);
    };

    const resetSOS = () => {
        setStatus('idle');
        setProgress(0);
        speak("Distress signal cancelled.");
    };

    return (
        <>
            {/* The Floating Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <button
                    onMouseDown={startPress}
                    onMouseUp={endPress}
                    onMouseLeave={endPress}
                    onTouchStart={startPress}
                    onTouchEnd={endPress}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all ${status === 'sent' ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-br from-red-500 to-red-700'
                        }`}
                >
                    <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                    {status === 'pressing' && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="40" cy="40" r="36"
                                fill="transparent"
                                stroke="white"
                                strokeWidth="4"
                                strokeDasharray="226" // 2 * pi * 36
                                strokeDashoffset={226 - (226 * progress) / 100}
                                className="transition-all duration-75"
                            />
                        </svg>
                    )}
                    <span className="font-bold text-white text-xl">SOS</span>
                </button>
                <span className="text-xs font-bold text-red-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {status === 'sent' ? 'SIGNAL ACTIVE' : 'HOLD 3s'}
                </span>
            </motion.div>

            {/* Emergency Overlay */}
            <AnimatePresence>
                {status === 'sent' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-red-900/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <div className="max-w-md w-full bg-black/40 border border-red-500/50 rounded-2xl p-8 text-center relative overflow-hidden">
                            {/* Radar Effect Background */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border rounded-full border-red-500 animate-[ping_2s_linear_infinite]" />
                            </div>

                            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />

                            <h2 className="text-3xl font-bold text-white mb-2">MAYDAY SIGNAL SENT</h2>
                            <p className="text-red-200 mb-8">Do not power off your device. Broadcasting location...</p>

                            <div className="space-y-4 text-left bg-black/40 p-4 rounded-lg border border-white/10 mb-8">
                                <div className="flex items-center gap-3">
                                    <Navigation className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Your Coordinates</p>
                                        <p className="font-mono text-white">
                                            {location ? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Acquiring GPS...'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                                    <div>
                                        <p className="text-xs text-gray-400">Status</p>
                                        <p className="text-white font-bold">Broadcasting to Coast Guard...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Anchor className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Rescue ETA</p>
                                        <p className="text-green-400 font-bold">~15 Minutes</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetSOS}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white transition-all"
                            >
                                Cancel Distress Signal
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SOSButton;
