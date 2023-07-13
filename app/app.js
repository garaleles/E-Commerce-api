import express from 'express';
import connectDb from '../db/connectDb.js';
import dotenv from 'dotenv';
import userRoute from '../routes/usersRoute.js';
import productRoute from '../routes/productsRoute.js';
import categoriesRoute from '../routes/categoriesRoute.js';
import brandsRoute from '../routes/brandsRoute.js';
import colorsRoute from '../routes/colorsRoute.js';
import reviewsRoute from '../routes/reviewsRoute.js';
import ordersRoute from '../routes/ordersRoute.js';
import cors from 'cors';
import {
  globalErrorHandler,
  notFoundHandler,
} from '../middllewares/globalErrorHandler.js';
import morgan from 'morgan';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();

app.use(cors());
app.set('trust proxy', 1);
app.use(rateLimiter({ windowMs: 60 * 1000, max: 100 }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'));
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/categories', categoriesRoute);
app.use('/api/v1/brands', brandsRoute);
app.use('/api/v1/colors', colorsRoute);
app.use('/api/v1/reviews', reviewsRoute);
app.use('/api/v1/orders', ordersRoute);

// Connect to MongoDB
connectDb();

// Error Handler
app.use(globalErrorHandler, notFoundHandler);

export default app;
