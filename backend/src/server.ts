import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import dataRoutes from './routes/dataRoutes';
// import authRoutes from './routes/authRoutes'; // Commented out for now

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', aiRoutes);
app.use('/api', dataRoutes);
// app.use('/api', authRoutes); // Commented out for now

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('MAITRI Backend is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});