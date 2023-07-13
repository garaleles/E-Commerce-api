import express from 'express';
import * as product from '../controllers/productsCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, product.createProductCtrl);
router.get('/', product.getProductsCtrl);
router.get('/all', product.getProductsAllCtrl);
router.get('/:id', product.getProductCtrl);
router.put('/:id', requireSignIn, product.updateProductCtrl);
router.delete('/:id', requireSignIn, product.deleteProductCtrl);

export default router;

