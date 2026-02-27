import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker = () => {
    // Mock Live Market Data
    const marketData = [
        { harbour: 'Mumbai (Sasson)', species: 'Pomfret', price: 1200, change: +5.2 },
        { harbour: 'Alibaug', species: 'Pomfret', price: 1150, change: -2.1 },
        { harbour: 'Versova', species: 'Surmai', price: 850, change: +1.5 },
        { harbour: 'Ratnagiri', species: 'Mackerel', price: 220, change: +0.8 },
        { harbour: 'Malvan', species: 'Prawns', price: 450, change: -1.2 },
        { harbour: 'Goa (Panaji)', species: 'Kingfish', price: 900, change: +3.4 },
        { harbour: 'Mangalore', species: 'Sardines', price: 180, change: -0.5 },
    ];

    return (
        <div className="w-full bg-ocean border-y border-white/10 overflow-hidden py-2 mb-6">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear"
                    }}
                    className="flex gap-8 items-center"
                >
                    {[...marketData, ...marketData].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 px-4 border-r border-white/10 last:border-0">
                            <span className="text-gray-400 text-xs font-bold uppercase">{item.harbour}</span>
                            <span className="text-white text-sm font-bold">{item.species}</span>
                            <span className="text-aqua text-sm">₹{item.price}</span>
                            <span className={`text-xs flex items-center ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {Math.abs(item.change)}%
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default MarketTicker;
