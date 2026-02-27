import { Bar } from 'react-chartjs-2';
import { Plus, Download, Filter, TrendingUp, DollarSign, Weight, IndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CatchHistory = () => {
    const { t } = useTranslation();
    // Mock Data
    const catchData = {
        labels: [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun')],
        datasets: [
            {
                label: `Mackerel (${t('kg')})`,
                data: [1200, 1900, 3000, 2500, 2000, 3200],
                backgroundColor: 'rgba(0, 180, 216, 0.6)',
            },
            {
                label: `Tuna (${t('kg')})`,
                data: [800, 1200, 1500, 1000, 1800, 2200],
                backgroundColor: 'rgba(255, 122, 0, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9CA3AF' }
            },
            title: {
                display: false,
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

    const records = [
        { id: 1, date: '2024-06-15', location: 'Zone A2', species: 'Mackerel', quantity: '850 kg', profit: '₹3,400' },
        { id: 2, date: '2024-06-12', location: 'Zone B1', species: 'Tuna', quantity: '420 kg', profit: '₹2,100' },
        { id: 3, date: '2024-06-08', location: 'Zone A2', species: 'Sardines', quantity: '1,200 kg', profit: '₹1,800' },
        { id: 4, date: '2024-06-01', location: 'Zone C3', species: 'Mackerel', quantity: '600 kg', profit: '₹2,400' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 space-y-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-aqua-glow/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                        {t('fleet')} <span className="text-aqua-glow">{t('journal')}</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                        {t('historical_logs')}
                    </p>
                </div>
                <button className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t('archive_new_log')}
                </button>
            </header>

            {/* Stats Overview */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-[32px] border-white/5 relative overflow-hidden group hover:bg-white/2">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <IndianRupee className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">{t('net_revenue_ytd')}</p>
                            <h3 className="text-2xl font-black text-white">₹48,250</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full w-fit">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+15% {t('annual_growth')}</span>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-[32px] border-white/5 relative overflow-hidden group hover:bg-white/2">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full" />
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20 group-hover:scale-110 transition-transform">
                            <Weight className="w-6 h-6 text-aqua-glow" />
                        </div>
                        <div>
                            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">{t('payload_volume')}</p>
                            <h3 className="text-2xl font-black text-white">12,450 <span className="text-[10px] text-blue-200">KG</span></h3>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-[32px] border-white/5 relative overflow-hidden group hover:bg-white/2">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">{t('optimized_sector')}</p>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{t('zone')} <span className="text-aqua-glow">A2</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-3 glass-panel border-white/5 p-8 rounded-[40px] relative z-10 h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-5 h-5 text-aqua-glow" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{t('catch')} <span className="text-aqua-glow">{t('trends')}</span></h3>
                    </div>
                    <div className="h-80">
                        <Bar options={options} data={catchData} />
                    </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-3 glass-panel border-white/5 rounded-[40px] overflow-hidden relative z-10">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{t('extraction')} <span className="text-aqua-glow">{t('ledger')}</span></h3>
                        <div className="flex gap-3">
                            <button className="p-3 glass-panel border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                            <button className="p-3 glass-panel border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-blue-100">
                            <thead className="bg-[#020617] text-[10px] uppercase font-black tracking-widest text-aqua-glow">
                                <tr>
                                    <th className="px-8 py-5">{t('timestamp')}</th>
                                    <th className="px-8 py-5">{t('tactical_zone')}</th>
                                    <th className="px-8 py-5">{t('species')}</th>
                                    <th className="px-8 py-5">{t('payload')}</th>
                                    <th className="px-8 py-5">{t('net_revenue')}</th>
                                    <th className="px-8 py-5">{t('operations')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {records.map((record) => (
                                    <tr key={record.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-8 py-6 font-medium text-xs">{record.date}</td>
                                        <td className="px-8 py-6 text-xs italic font-black text-white tracking-tight">{record.location}</td>
                                        <td className="px-8 py-6"><span className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black text-aqua-glow uppercase tracking-widest">{record.species}</span></td>
                                        <td className="px-8 py-6 font-black text-white text-xs">{record.quantity}</td>
                                        <td className="px-8 py-6 font-black text-emerald-400 text-xs">{record.profit}</td>
                                        <td className="px-8 py-6">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-[#00B4D8] hover:text-white transition-colors border-b border-[#00B4D8]/30">{t('details')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatchHistory;
