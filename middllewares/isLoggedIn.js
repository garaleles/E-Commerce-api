import { getTokenFromHeader } from '../helpers/getTokenFromHeader.js';
import { verifyToken } from '../helpers/verifyToken.js';

const isLoggedIn = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    next(new Error('Bu işlemi yapmaya yetkiniz yok.'));
  }
  const decodedToken = await verifyToken(token);
  if (!decodedToken) {
    next(new Error('Bu işlemi yapmaya yetkiniz yok.'));
  }
  req.userAuthId = decodedToken?.id;
  next();
};

export default isLoggedIn;
