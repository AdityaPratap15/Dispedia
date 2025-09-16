const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database();

// For production deployment - bind to all interfaces
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database
db.init().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Database initialization failed:', err);
});

// Admin authentication (simple session-based)
let adminSession = null;

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const admin = await db.getAdmin(username);
        if (admin && await bcrypt.compare(password, admin.password)) {
            adminSession = { id: admin.id, username: admin.username };
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    adminSession = null;
    res.json({ success: true, message: 'Logged out successfully' });
});

// Check admin session
app.get('/api/admin/check', (req, res) => {
    res.json({ authenticated: adminSession !== null });
});

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    if (!adminSession) {
        return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    next();
};

// Get all diseases (public)
app.get('/api/diseases', async (req, res) => {
    try {
        const diseases = await db.getAllDiseases();
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching diseases' });
    }
});

// Get disease by ID (public)
app.get('/api/diseases/:id', async (req, res) => {
    try {
        const disease = await db.getDiseaseById(req.params.id);
        if (disease) {
            res.json(disease);
        } else {
            res.status(404).json({ success: false, message: 'Disease not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching disease' });
    }
});

// Search diseases (public)
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await db.searchDiseases(q);
        res.json(results);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching diseases' });
    }
});

// Admin routes - require authentication

// Add new disease (admin only)
app.post('/api/admin/diseases', requireAdmin, async (req, res) => {
    const { name, description, symptoms, treatment } = req.body;
    try {
        const id = await db.addDisease(name, description, symptoms, treatment);
        res.json({ success: true, id, message: 'Disease added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding disease' });
    }
});

// Update disease (admin only)
app.put('/api/admin/diseases/:id', requireAdmin, async (req, res) => {
    const { name, description, symptoms, treatment } = req.body;
    try {
        await db.updateDisease(req.params.id, name, description, symptoms, treatment);
        res.json({ success: true, message: 'Disease updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating disease' });
    }
});

// Delete disease (admin only)
app.delete('/api/admin/diseases/:id', requireAdmin, async (req, res) => {
    try {
        await db.deleteDisease(req.params.id);
        res.json({ success: true, message: 'Disease deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting disease' });
    }
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});

module.exports = app;