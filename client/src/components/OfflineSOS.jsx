import React, { useState, useEffect } from 'react';
import { ShieldAlert, Signal, Users, MapPin, Radio } from 'lucide-react';

const OfflineSOS = () => {
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [nearbyPeers, setNearbyPeers] = useState([]);
    const [meshStatus, setMeshStatus] = useState('Searching...');
    const [pulse, setPulse] = useState(false);

    // Simulate Mesh Network Discovery
    useEffect(() => {
        const timer = setInterval(() => {
            setMeshStatus('Connected');
            setNearbyPeers([
                { id: 'Boat-A12', dist: '0.8 km', signal: 92 },
                { id: 'Vessel-K9', dist: '2.1 km', signal: 78 },
                { id: 'Skiff-88', dist: '3.4 km', signal: 65 },
            ]);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Panic Button Simulation
    const handlePanic = () => {
        setIsBroadcasting(true);
        setPulse(true);
        // Simulate acknowledgement
        setTimeout(() => {
            alert("✅ SOS Acknowledged by 3 nearby vessels!");
            setIsBroadcasting(false);
            setPulse(false);
        }, 5000);
    };

    return (
        <div className="bg-ocean/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Radar Effect */}
            <div className={`absolute inset-0 bg-red-500/5 transition-opacity duration-1000 ${pulse ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Radio className={`w-5 h-5 ${meshStatus === 'Connected' ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`} />
                        Community Mesh Setup
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded bg-white/10 ${meshStatus === 'Connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {meshStatus}
                    </span>
                </div>

                {/* Nearby Boats List */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Nearby Rescuers (Offline)</p>
                    {nearbyPeers.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Scanning based on signal...</p>
                    ) : (
                        nearbyPeers.map(peer => (
                            <div key={peer.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-aqua" />
                                    <div>
                                        <p className="text-sm font-medium text-white">{peer.id}</p>
                                        <p className="text-xs text-gray-400">{peer.dist} away</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Signal className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-green-400">{peer.signal}%</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Big Red Panic Button */}
                <button
                    onClick={handlePanic}
                    disabled={isBroadcasting}
                    className={`w-full py-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isBroadcasting
                            ? 'bg-red-600 animate-pulse shadow-lg shadow-red-600/50'
                            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-900/50'
                        }`}
                >
                    <ShieldAlert className="w-8 h-8" />
                    {isBroadcasting ? 'BROADCASTING SOS...' : 'BROADCAST DISTRESS SIGNAL'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                    *Will relay to nearby boats via Bluetooth/LoRa even without Internet.
                </p>
            </div>
        </div>
    );
};

export default OfflineSOS;
