const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'server_debug.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

console.log = function (...args) {
    originalLog.apply(console, args);
    logStream.write(`[LOG] ${new Date().toISOString()}: ${args.join(' ')}\n`);
};
console.warn = function (...args) {
    originalWarn.apply(console, args);
    logStream.write(`[WARN] ${new Date().toISOString()}: ${args.join(' ')}\n`);
};
console.error = function (...args) {
    originalError.apply(console, args);
    logStream.write(`[ERROR] ${new Date().toISOString()}: ${args.join(' ')}\n`);
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prediction', require('./routes/prediction'));
app.use('/api/route', require('./routes/route'));
app.use('/api/catch', require('./routes/catch'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/market', require('./routes/market'));
app.use('/api/alerts', require('./routes/alert'));

app.get('/api/logs', (req, res) => {
    if (fs.existsSync(logFile)) {
        res.sendFile(logFile);
    } else {
        res.send('No logs yet');
    }
});

app.get('/', (req, res) => {
    res.send('AquaNova API Running (Supabase Edition)');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Supabase integrated as persistence layer`);
});
