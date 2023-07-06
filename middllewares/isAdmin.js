import User from '../models/user.js';

const isAdmin = async (req, res, next) => {
  //find the login user
  const user = await User.findById(req.userAuthId);

  //check if Admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error('Bu işlemi yapmaya yetkiniz yok.'));
  }
};

export default isAdmin;
