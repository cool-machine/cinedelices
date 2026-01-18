import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import router from './routes/index.js';
import viewRoutes from './routes/viewRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layout Configuration
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Default layout
app.set("layout extractScripts", true);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routing - API
app.use('/api/v1', router);

// Routing - Frontend Views
app.use('/', viewRoutes);

// Basic Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CinéDélices API is running' });
});

// 404 Handler (Last route)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Non Trouvée' });
});

export default app;
