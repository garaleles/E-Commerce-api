import express from 'express';
import * as color from '../controllers/colorsCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, color.createColorCtrl);
router.get('/', color.getAllColorsCtrl);
router.get('/:id', color.getColorByIdCtrl);
router.put('/:id', requireSignIn, color.updateColorCtrl);
router.delete('/:id', requireSignIn, color.deleteColorCtrl);

export default router;
