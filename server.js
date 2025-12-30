const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'kronan.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve static files (HTML, JS, CSS)

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure data file exists (create valid JSON if not)
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ created: new Date() }));
}

// API Routes
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading data:', err);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

app.post('/api/data', (req, res) => {
    try {
        const data = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Serve the main app on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'kronan-lit-v3.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
