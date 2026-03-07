import express from 'express';
import cors from 'cors';
import { pool, initSchema } from '../src/lib/db.ts';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize schema on startup
initSchema().then(() => {
    console.log('✔ Neon Database is ready');
}).catch(err => {
    console.error('❌ Database initialization failed:', err);
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Phase 11 & 10: Initialize User (MantraCare ID)
app.post('/api/init-user', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'User ID is required' });

    try {
        await pool.query(
            'INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
            [user_id]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error initializing user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Phase 12: Enforce User Isolation in History
app.get('/api/history', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'User ID is required' });

    try {
        const result = await pool.query(
            'SELECT TO_CHAR(date, \'YYYY-MM-DD\') as date, level, factors, note FROM energy_entries WHERE user_id = $1 ORDER BY date DESC',
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Phase 5 & 12: Save Check-in with User Isolation & Parameterized Query
app.post('/api/save-checkin', async (req, res) => {
    const { user_id, entry } = req.body;
    if (!user_id || !entry) return res.status(400).json({ error: 'User ID and entry are required' });

    const { date, level, factors, note } = entry;

    try {
        await pool.query(
            `INSERT INTO energy_entries (user_id, date, level, factors, note)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id, date) DO UPDATE 
             SET level = EXCLUDED.level,
                 factors = EXCLUDED.factors,
                 note = EXCLUDED.note,
                 updated_at = NOW()`,
            [user_id, date, level, factors, note]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error saving energy entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 Backend Server running on port ${port}`);
});
