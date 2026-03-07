import { pool, initSchema } from '../src/lib/db.ts';
import * as dotenv from 'dotenv';

dotenv.config();

async function validate() {
    console.log('--- Starting Phase 6: Database Validation ---');

    try {
        // 1. Connection check
        const nowRes = await pool.query('SELECT NOW()');
        console.log('✔ Database connection established:', nowRes.rows[0].now);

        // 2. Schema initialization
        await initSchema();
        console.log('✔ Schema successfully created/verified');

        const testUserId = 999999999;
        const testDate = new Date().toISOString().split('T')[0];

        // 3. Test insert (User)
        await pool.query('INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [testUserId]);
        console.log('✔ User creation works');

        // 4. Test write (Energy entry)
        await pool.query(
            `INSERT INTO energy_entries (user_id, date, level, factors, note)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, date) DO UPDATE SET level = EXCLUDED.level`,
            [testUserId, testDate, 'high', ['Sleep', 'Exercise'], 'Validation Test']
        );
        console.log('✔ Test insert works');

        // 5. Test read
        const readRes = await pool.query('SELECT * FROM energy_entries WHERE user_id = $1', [testUserId]);
        if (readRes.rows.length > 0) {
            console.log('✔ Test read works:', readRes.rows[0].level);
        } else {
            throw new Error('Read failed: No records found');
        }

        // 6. Test delete
        await pool.query('DELETE FROM energy_entries WHERE user_id = $1', [testUserId]);
        await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
        console.log('✔ Test delete works');

        console.log('--- Phase 6: Database Validation Passed ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database validation failed:', err);
        process.exit(1);
    }
}

validate();
