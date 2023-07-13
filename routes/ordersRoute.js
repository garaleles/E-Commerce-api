import express from 'express';
import * as orderCtrl from '../controllers/orderCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, orderCtrl.createOrderCtrl);

export default router;
