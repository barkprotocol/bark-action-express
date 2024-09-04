import express from 'express';
import dotenv from 'dotenv';
import mintRouter from './routes/mint';
import donationBarkRouter from './routes/donation_bark';
import donationSolRouter from './routes/donation_sol';
import donationUsdcRouter from './routes/donation_usdc';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Use routes with distinct base paths to avoid conflicts
app.use('/api/mint', mintRouter);
app.use('/api/donation/bark', donationBarkRouter);
app.use('/api/donation/sol', donationSolRouter);
app.use('/api/donation/usdc', donationUsdcRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
