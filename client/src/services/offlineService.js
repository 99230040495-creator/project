import api from './api';

const STORAGE_KEYS = {
    FISH_ZONES: 'offline_fish_zones',
    SEASONAL_DATA: 'offline_seasonal_data',
    WEATHER: 'offline_weather',
    CATCH_HISTORY: 'offline_catch_history',
    MARKET_PRICES: 'offline_market_prices',
    LAST_SYNC: 'offline_last_sync',
    ALERTS_QUEUE: 'offline_alerts_queue'
};

export const syncAllData = async (coords = null) => {
    try {
        console.log('Starting data sync...');

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const locationName = user.location || 'Mumbai';

        // Use passed coords or fallback to user profile coords
        const lat = coords?.lat || user.lat || 18.975;
        const lng = coords?.lng || user.lng || 72.825;

        // Parallel requests for faster sync
        const [fishZones, seasonalData, weather, catchHistory, marketPrices] = await Promise.all([
            api.get(`/prediction/fish-zones?lat=${lat}&lng=${lng}`).catch(err => { console.error('Failed to sync fish zones', err); return { data: null }; }),
            api.get('/prediction/seasonal-data').catch(err => { console.error('Failed to sync seasonal data', err); return { data: null }; }),
            api.get(`/weather/current?locationName=${locationName}`).catch(err => { console.error('Failed to sync weather', err); return { data: null }; }),
            api.get('/catch/history').catch(err => { console.error('Failed to sync catch history', err); return { data: null }; }),
            api.get('/market/prices').catch(err => { console.error('Failed to sync market prices', err); return { data: null }; })
        ]);

        if (fishZones.data) localStorage.setItem(STORAGE_KEYS.FISH_ZONES, JSON.stringify(fishZones.data));
        if (seasonalData.data) localStorage.setItem(STORAGE_KEYS.SEASONAL_DATA, JSON.stringify(seasonalData.data));
        if (weather.data) localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weather.data));
        if (catchHistory.data) localStorage.setItem(STORAGE_KEYS.CATCH_HISTORY, JSON.stringify(catchHistory.data));
        if (marketPrices.data) localStorage.setItem(STORAGE_KEYS.MARKET_PRICES, JSON.stringify(marketPrices.data));

        // Sync pending alerts
        await syncPendingAlerts();

        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

        console.log('Data sync completed successfully for location:', lat, lng);
        return true;
    } catch (error) {
        console.error('Data sync failed:', error);
        return false;
    }
};

export const getOfflineData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const getFishZones = () => getOfflineData(STORAGE_KEYS.FISH_ZONES);
export const getWeather = () => getOfflineData(STORAGE_KEYS.WEATHER);
export const getSeasonalData = () => getOfflineData(STORAGE_KEYS.SEASONAL_DATA);
export const getCatchHistory = () => getOfflineData(STORAGE_KEYS.CATCH_HISTORY);
export const getMarketPrices = () => getOfflineData(STORAGE_KEYS.MARKET_PRICES);
export const getLastSyncTime = () => localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

// Alert Offline Helpers
export const queueOfflineAlert = (alertData) => {
    const queue = getOfflineData(STORAGE_KEYS.ALERTS_QUEUE) || [];
    queue.push({
        ...alertData,
        id: `offline-${Date.now()}`,
        pending: true,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.ALERTS_QUEUE, JSON.stringify(queue));
};

export const getPendingAlerts = () => getOfflineData(STORAGE_KEYS.ALERTS_QUEUE) || [];

export const syncPendingAlerts = async () => {
    const queue = getPendingAlerts();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} pending alerts...`);
    const remainingQueue = [];

    for (const alert of queue) {
        try {
            await api.post('/alerts', alert);
        } catch (error) {
            console.error('Failed to sync alert, keeping in queue:', error);
            remainingQueue.push(alert);
        }
    }

    localStorage.setItem(STORAGE_KEYS.ALERTS_QUEUE, JSON.stringify(remainingQueue));
};
