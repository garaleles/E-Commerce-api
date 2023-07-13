import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrderCtrl = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //find user
  const user = await User.findById(req.user._id);
  //check if user exists
  if (!user) {
    res.status(404);
    throw new Error('Kullanıcı bulunamadı');
  }
//check if shippingAddress
  if (!user?.hasShippingAddress) {
    res.status(400);
    throw new Error('Lütfen önce adres bilgilerinizi giriniz');
   }
  
  //check if orderItems is empty
  if (orderItems?.length === 0) {
    res.status(400);
    throw new Error('Siparişiniz boş');
  }
  //create order
  const order = await Order.create({
    orderItems,
    shippingAddress,
    totalPrice,
    user: req.user?._id,
  });
  //save order
  const createdOrder = await order.save();
  //send response
  res.status(201).json({
    status: 'success',
    message: 'Siparişiniz başarıyla oluşturuldu',
    _id: createdOrder._id,
    orderItems: createdOrder.orderItems,
    shippingAddress: createdOrder.shippingAddress,
    totalPrice: createdOrder.totalPrice,
    user: createdOrder.user,
  });

  //update stock
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  //update user orders
  user.orders?.push(createdOrder._id);
  await user.save();

  
});
