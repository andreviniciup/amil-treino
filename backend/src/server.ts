import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import exerciseRoutes from './routes/exerciseRoutes';
import workoutRoutes from './routes/workoutRoutes';
import userRoutes from './routes/userRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
// MVP v0.01: Rotas de progresso e gamificação desabilitadas temporariamente
// TODO: Reativar na v0.02
// import progressRoutes from './routes/progressRoutes';
// import gamificationRoutes from './routes/gamificationRoutes';
import { errorHandler } from './middleware/errorHandler';
import prisma from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://treino-amil.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Allow all .vercel.app domains
    const isVercelDomain = origin.includes('.vercel.app');
    const isAllowedOrigin = allowedOrigins.indexOf(origin) !== -1;
    
    if (isVercelDomain || isAllowedOrigin) {
      console.log(`✅ CORS: Allowing origin ${origin}`);
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
// MVP v0.01: Rotas de progresso e gamificação desabilitadas temporariamente
// TODO: Reativar na v0.02
// app.use('/api/progress', progressRoutes);
// app.use('/api/gamification', gamificationRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Treino API - Backend server is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      exercises: '/api/exercises',
      workouts: '/api/workouts',
      users: '/api/users',
      recommendations: '/api/recommendations'
      // MVP v0.01: Endpoints de progresso e gamificação desabilitados temporariamente
      // TODO: Reativar na v0.02
      // progress: '/api/progress',
      // gamification: '/api/gamification'
    }
  });
});

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log('===========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('===========================================');
  
  // MVP v0.01: Serviços de seed e cache automáticos desabilitados
  // O banco já está populado, não precisa de inicialização
  // TODO v0.02: Adicionar flag de ambiente para controlar seed/cache
  
  // Verificar estado do banco (apenas log, sem seed automático)
  try {
    const exerciseCount = await prisma.exercise.count();
    console.log(`📊 Database status: ${exerciseCount} exercises available`);
    
    if (exerciseCount === 0) {
      console.warn('⚠️  WARNING: Database is empty! Run seed manually if needed:');
      console.warn('   npm run seed');
    } else {
      console.log('✅ Database ready - queries will use local data only');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
  
  console.log('🚀 Server ready - optimized for direct database queries');
  console.log('===========================================\n');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('🚨 Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

