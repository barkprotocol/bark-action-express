import express from 'express';
import dotenv from 'dotenv';
import mintRouter from './routes/mint';
import donationBarkRouter from './routes/donation_bark';
import donationSolRouter from './routes/donation_sol';
import donationUsdcRouter from './routes/donation_usdc';
import winston from 'winston';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [new winston.transports.Console()],
});

// Middleware to parse JSON
app.use(express.json());

// Use routes with distinct base paths to avoid conflicts
app.use('/api/mint', mintRouter);
app.use('/api/donation/bark', donationBarkRouter);
app.use('/api/donation/sol', donationSolRouter);
app.use('/api/donation/usdc', donationUsdcRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
