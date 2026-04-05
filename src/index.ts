import express, { type Request, type Response } from 'express';
import path from 'node:path';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import './config/passport.js';
import { limiter } from './config/rate-limiter.js';
import swaggerDocument from './docs/index.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import authRouter from './routes/auth.route.js';
import postsRouter from './routes/posts.route.js';
import uploadRouter from './routes/upload.route.js';
import usersRouter from './routes/users.route.js';
import pollingRouter from './routes/polling.route.js';
import { NotFoundError } from './utils/errors.js';

const PORT = 2200;
const publicDir = path.resolve(process.cwd(), 'public');

const app = express();
app.use(express.json());
app.use(express.static(publicDir));
app.use(morganMiddleware);

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Hello World',
  });
});
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.use('/polling', pollingRouter);

app.all('*path', (req: Request, res: Response) => {
  throw new NotFoundError('Resource not found');
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
