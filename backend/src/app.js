import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import viewRoutes from './routes/viewRoutes.js';
import { verifyToken } from './utils/jwt.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layout Configuration
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Default layout
app.set('layout extractScripts', true);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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

// Extract user from token for all views (optional auth)
app.use((req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
            res.locals.user = decoded;
        }
    } catch {
        // Token invalid or expired - continue without user
    }
    next();
});

// Routing - API
app.use('/api/v1', apiLimiter, router);

// Auth rate limiting for view routes
app.use(['/login', '/register'], authLimiter);

// Routing - Frontend Views
app.use('/', viewRoutes);

// Basic Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CinéDélices API is running' });
});

// 404 Handler (Last route)
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Non Trouvée' });
});

export default app;
