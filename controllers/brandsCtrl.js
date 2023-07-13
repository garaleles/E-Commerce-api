import brand from '../models/Brand.js';
import asyncHandler from 'express-async-handler';

export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //exists brand
  const brandExists = await brand.findOne({ name });
  if (brandExists) {
    res.status(400);
    throw new Error('Bu marka zaten var.');
  }

  const newBrand = new brand({
    name: name.toLowerCase(),
    user: req.user._id,
  });
  const savedBrand = await newBrand.save();
  res.status(201).json({
    message: 'Marka başarıyla oluşturuldu.',
    brand: savedBrand,
  });
});

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await brand.find({}).populate('user', 'name');
  res.status(200).json({
    message: 'Markalar başarıyla getirildi.',
    brands,
  });
});

export const getBrandByIdCtrl = asyncHandler(async (req, res) => {
  const brandById = await brand
    .findById(req.params.id)
    .populate('user', 'name');
  if (!brandById) {
    res.status(404);
    throw new Error('Marka bulunamadı.');
  }

  res.status(200).json({
    message: 'Marka başarıyla getirildi.',
    brand: brandById,
  });
});

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const brandById = await brand.findById(req.params.id);
  if (!brandById) {
    res.status(404);
    throw new Error('Marka bulunamadı.');
  }

  brandById.name = req.body.name || brandById.name;
  brandById.user = req.user._id || brandById.user;

  const updatedBrand = await brandById.save();
  res.status(200).json({
    message: 'Marka başarıyla güncellendi.',
    brand: updatedBrand,
  });
});

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const brandById = await brand.findById(req.params.id);
  if (!brandById) {
    res.status(404);
    throw new Error('Marka bulunamadı.');
  }

  await brandById.deleteOne();
  res.status(200).json({
    message: 'Marka başarıyla silindi.',
    brand: brandById,
  });
});
