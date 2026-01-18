import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/v1', router);

// Basic Health Check (Optional: could also be moved to routes)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CinéDélices API is running' });
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to CinéDélices API');
});

export default app;
