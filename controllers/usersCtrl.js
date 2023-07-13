import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import validator from 'email-validator';
import sgMail from '@sendgrid/mail';
import { nanoid } from 'nanoid';
import { comparePassword, hashPassword } from '../helpers/cryptPassword.js';

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  user.password = undefined;
  user.resetCode = undefined;

  return res.json({
    token,
    refreshToken,
    user,
  });
};

export const preRegisterUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!validator.validate(email)) {
    res.status(400);
    throw new Error('Lütfen geçerli bir email adresi giriniz.');
  }
  if (!password) {
    res.status(400);
    throw new Error('Lütfen bir şifre giriniz.');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Şifreniz en az 6 karakterden oluşmalıdır.');
  }
  //check user exists
  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error('Bu email adresi ile daha önce kayıt olunmuş.');
  }
  //token ayarla
  const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //email gönder
  const url = `${process.env.EMAIL_CLIENT_URL}/auth/account-activate/${token}`;
  const message = `Hesabınızı aktifleştirmek için lütfen aşağıdaki linke tıklayınız. ${url}`;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: process.env.EMAIL_SUBJECT,
    text: process.env.EMAIL_TEXT,
    html: `<strong>${message}</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('E-Posta gönderildi.');
      res.send('E-Posta gönderildi.');
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    });
});

export const registerUserCtrl = asyncHandler(async (req, res) => {
  try {
    const { email, password } = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET
    );

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        error: 'Bu e-posta adresi ile daha önce kayıt olunmuş.',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
      userName: nanoid(10),
    });

    await user.save();

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    throw new Error('message');
  }
});

export const loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'E-posta adresiniz veya şifreniz hatalı.',
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).json({
        error: 'E-posta adresiniz veya şifreniz hatalı.',
      });
    }

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    throw new Error(message);
  }
});

export const forgotPasswordCtrl = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'Bu e-postaya ait kullanıcı bulunamadı.' });
    } else {
      const resetCode = nanoid();
      user.resetCode = resetCode;
      user.save();

      const token = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      //email gönder
      const url = `${process.env.EMAIL_CLIENT_URL}/auth/access-account/${token}`;
      const message = `Hesabınıza erişmek için lütfen aşağıdaki linke tıklayınız. ${url}`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: process.env.EMAIL_SUBJECT_FORGOT,
        text: process.env.EMAIL_TEXT,
        html: `<strong>${message}</strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('E-Posta gönderildi.');
          res.send('E-Posta gönderildi.');
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('E-Posta gönderilemedi.');
        });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Bilinmeyen bir hata oluştu. Daha sonra tekrar deneyiniz.');
  }
});

export const accessAccountCtrl = asyncHandler(async (req, res) => {
  try {
    const { resetCode } = jwt.verify(
      req.body.resetCode,
      process.env.JWT_SECRET
    );

    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: '' });

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    throw new Error(message);
  }
});

export const refreshTokenCtrl = asyncHandler(async (req, res) => {
  try {
    const { _id } = jwt.verify(
      req.headers.refresh_token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(_id);

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: 'Token yenileme başarısız oldu.',
    });
  }
});

export const currentUserCtrl = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    return res.json({ ok: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: 'Yetkisiz erişim.',
    });
  }
});

export const publicProfileCtrl = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
  }
});
export const updatePasswordCtrl = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Şifre alanı boş bırakılamaz.' });
    }
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Şifre en az 6 karakter olmalıdır.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id);
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.save();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: 'Yetkisiz erişim.',
    });
  }
});

export const updateProfileCtrl = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json({ ok: true, data: user });
  } catch (error) {
    console.log(error);

    if (error.codeName === 'DuplicateKey') {
      return res.status(400).json({
        error: 'Bu kullanıcı adı veya e-posta ile daha önce kayıt olunmuş.',
      });
    } else {
      return res.status(403).json({
        error: 'Yetkisiz erişim.',
      });
    }
  }
});

export const updateShippingAddresctrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  //send response
  res.json({
    status: 'success',
    message: 'Kullanıcı teslimat adresi güncellendi.',
    user,
  });
});


