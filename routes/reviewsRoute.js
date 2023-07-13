import express from 'express';
import * as review from '../controllers/reviewsCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/create/:productId', requireSignIn, review.createReviewCtrl);
router.get('/', review.getAllReviewsCtrl);
router.get('/:id', review.getReviewByIdCtrl);
router.put('/:id', requireSignIn, review.updateReviewCtrl);
router.delete('/:id', requireSignIn, review.deleteReviewCtrl);

export default router;
