import express from 'express';
import * as product from '../controllers/productsCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, product.createProductCtrl);
router.get('/', product.getProductsCtrl);

export default router;
