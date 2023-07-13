import Color from '../models/color.js';
import asyncHandler from 'express-async-handler';

export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //exists color
  const colorExists = await Color.findOne({ name });
  if (colorExists) {
    res.status(400);
    throw new Error('Bu renk zaten var.');
  }

  const color = new Color({
    name: name.toLowerCase(),
    user: req.user._id,
  });
  const createdColor = await color.save();
  res.status(201).json({
    status: 'success',
    message: 'Renk başarıyla oluşturuldu.',
    color: createdColor,
  });
});

export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find({}).populate('user', 'name');
  res.status(200).json({
    status: 'success',
    message: 'Renkler başarıyla getirildi.',
    colors,
  });
});

export const getColorByIdCtrl = asyncHandler(async (req, res) => {
  const colorById = await Color.findById(req.params.id).populate(
    'user',
    'name'
  );
  if (!colorById) {
    res.status(404);
    throw new Error('Renk bulunamadı.');
  }

  res.status(200).json({
    status: 'success',
    message: 'Renk başarıyla getirildi.',
    color: colorById,
  });
});

export const updateColorCtrl = asyncHandler(async (req, res) => {
  const colorById = await Color.findById(req.params.id);
  if (!colorById) {
    res.status(404);
    throw new Error('Renk bulunamadı.');
  }

  colorById.name = req.body.name || colorById.name;
  colorById.user = req.user._id || colorById.user;

  const updatedColor = await colorById.save();
  res.status(200).json({
    status: 'success',
    message: 'Renk başarıyla güncellendi.',
    color: updatedColor,
  });
});

export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const colorById = await Color.findById(req.params.id);
  if (!colorById) {
    res.status(404);
    throw new Error('Renk bulunamadı.');
  }

  await colorById.deleteOne();
  res.status(200).json({
    status: 'success',
    message: 'Renk başarıyla silindi.',
  });
});
