require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const { connectDatabase } = require('./config/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const sanitizeRequest = require('./middleware/sanitizeRequest');

const PORT = Number(process.env.PORT) || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';
const serveClient = process.env.SERVE_CLIENT === 'true';
const clientDist = path.join(__dirname, '..', 'client', 'dist');

const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
    referrerPolicy: { policy: 'no-referrer' },
  })
);

app.use(
  cors({
    origin: serveClient ? true : CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeRequest);
app.use(hpp());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: isProduction ? '7d' : 0,
    fallthrough: true,
    setHeaders(res) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wedding Point API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRoutes);

if (serveClient && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: isProduction ? '1d' : 0 }));

  app.get(/^(?!\/api(?:\/|$)|\/uploads(?:\/|$)).*/, (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    return res.sendFile(path.join(clientDist, 'index.html'), (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined. Set it in server/.env');
    }

    if (
      isProduction &&
      (process.env.JWT_SECRET.length < 32 ||
        process.env.JWT_SECRET.includes('change-this'))
    ) {
      throw new Error(
        'JWT_SECRET is too weak for production. Use a long random secret.'
      );
    }

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      if (serveClient) {
        console.log(`Serving client from ${clientDist}`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
