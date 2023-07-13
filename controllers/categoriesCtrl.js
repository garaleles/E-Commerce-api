import category from '../models/Category.js';
import asyncHandler from 'express-async-handler';

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryExists = await category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Kategori zaten mevcut.');
  }

  const newCategory = new category({
    name: name.toLowerCase(),
    user: req.user._id,
  });
  const createdCategory = await newCategory.save();

  res.status(201).json({
    status: 'success',
    message: 'Kategori başarıyla oluşturuldu.',
    data: createdCategory,
  });
});

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await category.find({}).populate('user', 'name');
  res.status(200).json({
    status: 'success',
    message: 'Kategoriler başarıyla getirildi.',
    data: categories,
  });
});

export const getCategoryByIdCtrl = asyncHandler(async (req, res) => {
  const categoryById = await category
    .findById(req.params.id)
    .populate('user', 'name');
  if (!categoryById) {
    res.status(404);
    throw new Error('Kategori bulunamadı.');
  }

  res.status(200).json({
    status: 'success',
    message: 'Kategori başarıyla getirildi.',
    data: categoryById,
  });
});

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const categoryById = await category.findById(req.params.id);
  if (!categoryById) {
    res.status(404);
    throw new Error('Kategori bulunamadı.');
  }

  categoryById.name = req.body.name || categoryById.name;
  categoryById.user = req.user._id || categoryById.user;

  const updatedCategory = await categoryById.save();

  res.status(200).json({
    status: 'success',
    message: 'Kategori başarıyla güncellendi.',
    data: updatedCategory,
  });
});

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const categoryById = await category.findById(req.params.id);
  if (!categoryById) {
    res.status(404);
    throw new Error('Kategori bulunamadı.');
  }

  await categoryById.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Kategori başarıyla silindi.',
    data: {},
  });
});
