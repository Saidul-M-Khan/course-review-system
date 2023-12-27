import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';

const app: Application = express();

//! parsers (Middlewares)
app.use(express.json());
app.use(cors());

//! application routes
app.use('/api/', router);

const authRouter = express.Router();
app.use('/auth/', authRouter);

//! server response
const test = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Course Review System REST API',
    error: null,
  });
};

//! test route
app.get('/', test);

//! use global error handler (Middlewares)
app.use(globalErrorHandler);

//! not found error handler (Middlewares)
app.use(notFound);

export default app;
