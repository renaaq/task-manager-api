const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Error en pool:', err);
});

// Middleware
app.use(express.json());
app.use(express.static('public'));


// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

// Ruta health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Ruta para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "usuario no encontrado" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body

        const result = await pool.query('UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *',
            [email, password, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "usuario invalido" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "usuario no encontrado" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, user_id = 1 } = req.body;  // DEFAULT 1
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *', [title, description, user_id]
        );
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;  // Campos de tasks

        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title, description, completed, id]  // $1 title, $2 desc, $3 completed, $4 id
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static('public'));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
