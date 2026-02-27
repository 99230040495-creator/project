import React from 'react';
import { ArrowLeft, TrendingUp, Navigation, Fuel, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMarketPrices, syncAllData } from '../services/offlineService';

const MarketPrices = () => {
    const { t } = useTranslation();
    const [markets, setMarkets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadMarketData = async () => {
            setLoading(true);
            try {
                // Try to load from local storage
                const offlineMarkets = getMarketPrices();
                if (offlineMarkets && offlineMarkets.markets) {
                    setMarkets(offlineMarkets.markets);
                }

                // If onlined, sync fresh data
                if (navigator.onLine) {
                    await syncAllData();
                    const freshData = getMarketPrices();
                    if (freshData && freshData.markets) {
                        setMarkets(freshData.markets);
                    }
                }
            } catch (error) {
                console.error("Failed to load market data", error);
            } finally {
                setLoading(false);
            }
        };

        loadMarketData();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
                <header className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-3 glass-panel border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-5 h-5 text-aqua-glow" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                            {t('market')} <span className="text-aqua-glow">{t('intelligence')}</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            {t('market_intel_desc')}
                        </p>
                    </div>
                </header>

                <div className="space-y-6">
                    {/* Visual Recommendation */}
                    {!loading && markets.some(m => m.isRecommended) && (
                        <div className="glass-panel border-emerald-500/20 p-6 rounded-[32px] flex items-start gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                            <div className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-emerald-400 uppercase tracking-tight italic">{t('ai_recommendation')}</h3>
                                <p className="text-gray-400 text-sm mt-1 font-medium leading-relaxed">
                                    {t('strategy_target')} <span className="text-white font-black">{markets.find(m => m.isRecommended)?.name}</span>. {t('optimized_trade_desc')}
                                </p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-aqua-glow/20 border-t-aqua-glow rounded-full animate-spin mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse">{t('syncing_market')}</p>
                        </div>
                    )}

                    {/* Market List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {markets.map(market => (
                            <div key={market.id} className={`p-8 rounded-[32px] border transition-all min-h-[220px] flex flex-col justify-between ${market.isRecommended ? 'glass-panel border-aqua-glow/40 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'glass-panel border-white/5 bg-white/2 hover:border-white/10'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-none">{market.name}</h3>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <Navigation className="w-3.5 h-3.5 text-aqua-glow" /> {market.distance}
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <Fuel className="w-3.5 h-3.5 text-aqua-glow" /> {t('fuel_cost')}: ₹{market.fuelCost}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{t('market_value')}</p>
                                        <p className={`text-3xl font-black leading-none ${market.isRecommended ? 'text-aqua-glow' : 'text-white'}`}>
                                            <span className="text-base font-light text-gray-500 mr-1">₹</span>
                                            {market.price}
                                            <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest ml-1">/kg</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    {market.isRecommended ? (
                                        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-aqua-glow text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            {t('establish_route')}
                                        </button>
                                    ) : (
                                        <button className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:text-white hover:bg-white/10 transition-all">
                                            {t('select_sector')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contextual Voice Help */}
                <div className="fixed bottom-24 left-6 max-w-xs text-left text-xs text-gray-500">
                    {t('market_tip')}
                </div>
            </div>
        </div>
    );
};

export default MarketPrices;
