import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Anchor, ArrowUp, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SentinelCompass = ({ targetCoords, targetName }) => {
    const { t } = useTranslation();
    const [currentPos, setCurrentPos] = useState(null);
    const [heading, setHeading] = useState(0); // Device orientation (0 = North)
    const [bearing, setBearing] = useState(0); // Direction to target relative to North
    const [distance, setDistance] = useState(0);
    const [error, setError] = useState(null);
    const [isCalibrating, setIsCalibrating] = useState(false);

    // 1. Get real-time GPS
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("GPS not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setCurrentPos({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            (err) => setError("Location access denied"),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // 2. Get device orientation (Compass)
    useEffect(() => {
        const handleOrientation = (event) => {
            // webkitCompassHeading is iOS only, alpha is standard but often needs adjustment
            let compassHeading = event.webkitCompassHeading || (360 - event.alpha);
            if (compassHeading !== undefined) {
                setHeading(compassHeading);
            }
        };

        if (window.DeviceOrientationEvent) {
            // Request permission for iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                setIsCalibrating(true);
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            setError("Compass not supported");
        }

        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const requestPermission = async () => {
        try {
            const response = await DeviceOrientationEvent.requestPermission();
            if (response === 'granted') {
                window.addEventListener('deviceorientation', (event) => {
                    let compassHeading = event.webkitCompassHeading || (360 - event.alpha);
                    setHeading(compassHeading);
                });
                setIsCalibrating(false);
            }
        } catch (e) {
            setError("Compass permission denied");
        }
    };

    // 3. Calculate Bearing and Distance
    useEffect(() => {
        if (currentPos && targetCoords) {
            const toRad = (deg) => deg * Math.PI / 180;
            const toDeg = (rad) => rad * 180 / Math.PI;

            const lat1 = toRad(currentPos.lat);
            const lon1 = toRad(currentPos.lng);
            const lat2 = toRad(targetCoords[0]);
            const lon2 = toRad(targetCoords[1]);

            // Bearing calculation
            const dLon = lon2 - lon1;
            const y = Math.sin(dLon) * Math.cos(lat2);
            const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            let b = toDeg(Math.atan2(y, x));
            setBearing((b + 360) % 360);

            // Haversine Distance
            const R = 6371; // km
            const dLat = lat2 - lat1;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            setDistance(R * c);
        }
    }, [currentPos, targetCoords]);

    // The angle the arrow should rotate relative to the phone's top
    // (Bearing to target - Heading of phone)
    const arrowRotation = (bearing - heading + 360) % 360;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 underline">{t('navigation_error')}</h3>
                <p className="text-red-200 text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> {t('try_again')}
                </button>
            </div>
        );
    }

    if (isCalibrating) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-aqua/10 border border-aqua/30 rounded-2xl text-center">
                <Compass className="w-16 h-16 text-aqua mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-white mb-2">{t('enable_compass')}</h3>
                <p className="text-aqua/70 text-sm mb-6">{t('compass_permission_desc')}</p>
                <button onClick={requestPermission} className="px-6 py-3 bg-aqua text-ocean font-bold rounded-xl shadow-lg">
                    {t('grant_permission')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black rounded-3xl border-4 border-aqua shadow-[0_0_50px_rgba(0,180,216,0.3)] min-h-[400px]">
            <div className="text-center mb-8">
                <p className="text-aqua text-xs font-black uppercase tracking-[0.2em] mb-1">{t('targeting')}</p>
                <h2 className="text-3xl font-black text-white">{targetName || t('home_port')}</h2>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 border-8 border-white/5 rounded-full" />
                <div className="absolute top-0 transform -translate-y-4 flex flex-col items-center">
                    <span className="text-white font-black text-lg">N</span>
                    <div className="w-1 h-4 bg-white/30 rounded-full" />
                </div>
                <motion.div
                    animate={{ rotate: arrowRotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    <div className="relative">
                        <ArrowUp className="w-40 h-40 text-green-400 filter drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" strokeWidth={3} />
                        <ArrowUp className="absolute top-1 left-1 w-40 h-40 text-black/50 blur-sm -z-10" strokeWidth={3} />
                    </div>
                </motion.div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-black p-4 rounded-full border border-white/10 flex flex-col items-center">
                        <span className="text-gray-500 text-[10px] uppercase font-bold">{t('bearing')}</span>
                        <span className="text-white text-xl font-black">{Math.round(bearing)}°</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 w-full">
                <div className="text-center border-r border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Navigation className="w-4 h-4 text-aqua" />
                        <span className="text-gray-400 text-xs font-bold uppercase">{t('distance')}</span>
                    </div>
                    <p className="text-3xl font-black text-white">{distance.toFixed(1)}<span className="text-aqua text-sm ml-1">{t('km')}</span></p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Anchor className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-xs font-bold uppercase">{t('rel_bearing')}</span>
                    </div>
                    <p className="text-3xl font-black text-white">{Math.round(arrowRotation)}°<span className="text-green-400 text-sm ml-1">rel</span></p>
                </div>
            </div>

            <div className="mt-8 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {t('compass_safety_tip')}
                </p>
            </div>
        </div>
    );
};

export default SentinelCompass;
