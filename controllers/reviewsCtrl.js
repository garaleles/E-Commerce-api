import Review from '../models/review.js';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';
import User from '../models/User.js';

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { rating, product, user, message } = req.body;
  //find the product
  const { productId } = req.params;
  const productFound = await Product.findById(productId).populate('reviews');
  if (!productFound) {
    res.status(404);
    throw new Error('Ürün bulunamadı');
  }
  //check if the user already reviewed the product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user.toString() === req.user._id?.toString();
  });

  if (hasReviewed) {
    res.status(400);
    throw new Error('Ürün daha önce yorumlandı');
  }

  //create the review
  const review = await Review.create({
    user: req.user._id,
    product: productFound?._id,
    message,
    rating,
  });

  //add the review to the product
  productFound.reviews.push(review?._id);

  //save the product
  await productFound.save();
  res.status(201).json({
    success: true,
    message: 'Yorum eklendi',
  });

  //save the review
  await review.save();
  res.status(201).json({
    success: true,
    message: 'Yorum eklendi',
  });
});

export const getAllReviewsCtrl = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).populate('user', 'name');
  res.status(200).json({
    success: true,
    reviews,
  });
});

export const getReviewByIdCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate('user', 'name');
  if (!review) {
    res.status(404);
    throw new Error('Yorum bulunamadı');
  }
  res.status(200).json({
    success: true,
    review,
  });
});

export const updateReviewCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, rating } = req.body;
  const review = await Review.findById(id).populate('user', 'name');
  if (!review) {
    res.status(404);
    throw new Error('Yorum bulunamadı');
  }
  review.message = message || review.message;
  review.rating = rating || review.rating;
  await review.save();
  res.status(200).json({
    success: true,
    message: 'Yorum güncellendi',
  });
});

export const deleteReviewCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate('user', 'name');
  if (!review) {
    res.status(404);
    throw new Error('Yorum bulunamadı');
  }
  //remove the review from the product
  const product = await Product.findById(review.product);
  product.reviews = product.reviews.filter(
    (reviewId) => reviewId.toString() !== review._id.toString()
  );
  
  await product.save();

  await review.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Yorum silindi',
  });
});
