import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import { verifyToken } from './utils/jwt.js';

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number.parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number.parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 20,
    standardHeaders: true,
    legacyHeaders: false
});

if (process.env.DEBUG_405 === 'true') {
    app.use((req, res, next) => {
        res.on('finish', () => {
            if (res.statusCode === 405) {
                const contentType = req.headers['content-type'] || 'n/a';
                const hasCookie = Boolean(req.headers.cookie);
                const originalMethod = req.originalMethod ? ` original=${req.originalMethod}` : '';
                console.warn(`[405] ${req.method} ${req.originalUrl} content-type=${contentType} cookie=${hasCookie}${originalMethod}`);
            }
        });
        next();
    });
}

// Extract user from token (optional auth)
app.use((req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
        }
    } catch {
        // Token invalid or expired - continue without user
    }
    next();
});

// Auth rate limiting
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// API Routes
app.use('/api/v1', apiLimiter, router);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CinéDélices API is running' });
});

// 404 Handler for API
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

export default app;
