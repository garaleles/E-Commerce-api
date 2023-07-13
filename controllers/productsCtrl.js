import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';

export const createProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    colors,
    sizes,
    reviews,
    totalQty,
    brand,
    user,
  } = req.body;

  //product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error('Bu ürün zaten kayıtlı');
  }

  //find category
  const categoryFound = await Category.findOne({
    name: category.toLowerCase(),
  });
  if (!categoryFound) {
    res.status(400);
    throw new Error('Kategori bulunamadı.');
  }

  //find brand
  const brandFound = await Brand.findOne({
    name: brand.toLowerCase(),
  });
  if (!brandFound) {
    res.status(400);
    throw new Error('Marka bulunamadı.');
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    colors,
    sizes,
    reviews,
    totalQty,
    brand,
    user: req.user._id,
  });

  //push the product into category
  categoryFound.products.push(product._id);
  await categoryFound.save();

  //push the product into brand
  brandFound.products.push(product._id);
  await brandFound.save();

  if (product) {
    res.status(201).json({
      status: 'success',
      message: 'Ürün başarıyla eklendi',
      data: product,
    });
  } else {
    res.status(400);
    throw new Error('Ürün eklenemedi.');
  }
});

export const getProductsAllCtrl = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json({
    status: 'success',
    message: 'Ürünler başarıyla listelendi.',
    products,
  });
});

export const getProductsCtrl = asyncHandler(async (req, res) => {
  //query
  let productQuery = await Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: 'i' },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: 'i' },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: 'i' },
    });
  }

  //filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: 'i' },
    });
  }

  //filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: 'i' },
    });
  }
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split('-');
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }
  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate('reviews');
  res.json({
    status: 'success',
    total,
    results: products.length,
    pagination,
    message: 'Ürünler başarıyla listelendi.',
    products,
  });
});

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (product) {
    res.json({
      status: 'success',
      message: 'Ürün başarıyla listelendi.',
      product,
    });
  } else {
    res.status(404);
    throw new Error('Ürün bulunamadı.');
  }
});

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    colors,
    sizes,
    reviews,
    totalQty,
    brand,
    user,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.colors = colors;
    product.sizes = sizes;
    product.reviews = reviews;
    product.totalQty = totalQty;
    product.brand = brand;
    product.user = user;

    const updatedProduct = await product.save();
    res.json({
      status: 'success',
      message: 'Ürün başarıyla güncellendi.',
      data: updatedProduct,
    });
  } else {
    res.status(404);
    throw new Error('Ürün bulunamadı.');
  }
});

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({
      status: 'success',
      message: 'Ürün başarıyla silindi.',
    });
  } else {
    res.status(404);
    throw new Error('Ürün bulunamadı.');
  }
});
