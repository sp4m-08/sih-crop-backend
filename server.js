// server.js
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js'
import profileRoutes from './routes/profile.js'
import cors from 'cors'


const app = express();
const PORT = 3000;

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: 'http://localhost:5173' // Allow only your frontend's origin
}));

// Connect Database
connectDB().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});

// Define Routess
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);

app.get("/", (req, res) => {
    console.log("server is running");
    res.json({ message: "server is running" });
});

app.listen(PORT, () => {
    console.log(`Server has been started at http://localhost:${PORT}`);
});