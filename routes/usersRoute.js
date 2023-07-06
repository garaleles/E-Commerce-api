import express from 'express';
import * as user from '../controllers/usersCtrl.js';
import { requireSignIn } from '../middllewares/auth.js';

const router = express.Router();

router.post('/pre-register', user.preRegisterUserCtrl);
router.post('/register', user.registerUserCtrl);
router.post('/login', user.loginUserCtrl);
router.post('/forgot-password', user.forgotPasswordCtrl);
router.post('/access-account', user.accessAccountCtrl);
router.get('/refresh-token', user.refreshTokenCtrl);
router.get('/current-user', requireSignIn, user.currentUserCtrl);
router.get('/profile/:userName', user.publicProfileCtrl);
router.put('/update-password', requireSignIn, user.updatePasswordCtrl);
router.put('/update-profile', requireSignIn, user.updateProfileCtrl);
export default router;
