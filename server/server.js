import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import announcementRouter from './routes/announcementRoutes.js';
import userRouter from './routes/userRoutes.js';
import complaintRouter from './routes/complaintRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import feeRouter from './routes/feeRoutes.js';
import libraryRouter from './routes/libraryRoutes.js';
import courseRouter from './routes/courseRoutes.js';

const app = express();

await connectDB()

//Middleware
const normalizeOrigin = (origin) => origin.replace(/^['"]|['"]$/g, '').trim();
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const corsOptions = {
    origin: allowedOrigins.length
        ? (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.includes('*')) {
                return callback(null, true);
            }
            return callback(null, allowedOrigins.includes(origin));
        }
        : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json())

//Routes
app.get('/', (req, res) => res.send("API is working"))
app.use('/api/admin', adminRouter)
app.use('/api/announcement', announcementRouter)
app.use('/api/user', userRouter)
app.use('/api/complaint', complaintRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/fee', feeRouter)
app.use('/api/library', libraryRouter)
app.use('/api/course', courseRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

export default app;
