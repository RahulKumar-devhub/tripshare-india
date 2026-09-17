require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const buddyRoutes = require('./routes/buddyRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const storyRoutes = require('./routes/storyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const stayRoutes = require('./routes/stayRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// --- Core middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/buddies', buddyRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stays', stayRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({
    success: true,
    message: 'TripShare India API is running at full capacity.',
    timestamp: new Date().toISOString()
  })
);

// 404 handler for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API route not found.' }));

// --- Serve Frontend ---
const clientDistDir = path.join(__dirname, '..', 'client', 'dist');
const clientStaticDir = fs.existsSync(clientDistDir) ? clientDistDir : path.join(__dirname, '..', 'client');

app.use(express.static(clientStaticDir));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(clientStaticDir, 'index.html'));
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error.' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`TripShare India API running on http://localhost:${PORT}`));
});
