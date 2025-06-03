import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import { pool } from './config/database.js';
import { initRoutes } from './utils/helper.js';
import { bookingRoutes } from './controllers/bookingController.js';
import { parcelRoutes } from './controllers/ParcelController.js';
import { paymentRoutes } from './mpesa/PaymentController.js';
import { checkDatabase } from './scripts/checkDatabase.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT


 await checkDatabase()
  app.use('/api',initRoutes)
  app.use('/api',bookingRoutes)
  app.use('/api',parcelRoutes)
  app.use('/api',paymentRoutes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  

});
