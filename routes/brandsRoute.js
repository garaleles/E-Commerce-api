import express from 'express';
import * as brand from '../controllers/brandsCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, brand.createBrandCtrl);
router.get('/', brand.getAllBrandsCtrl);
router.get('/:id', brand.getBrandByIdCtrl);
router.put('/:id', requireSignIn, brand.updateBrandCtrl);
router.delete('/:id', requireSignIn, brand.deleteBrandCtrl);

export default router;
