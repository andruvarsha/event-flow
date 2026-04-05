require('dotenv').config();
const express = require('express');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Global Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip payload reduction
app.use(cors());
app.use(express.json());

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', limiter);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('EventFlow API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/registrations', registrationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
