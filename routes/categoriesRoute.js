import express from 'express';
import * as category from '../controllers/categoriesCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, category.createCategoryCtrl);
router.get('/', category.getAllCategoriesCtrl);
router.get('/:id', category.getCategoryByIdCtrl);
router.put('/:id', requireSignIn, category.updateCategoryCtrl);
router.delete('/:id', requireSignIn, category.deleteCategoryCtrl);


export default router;

