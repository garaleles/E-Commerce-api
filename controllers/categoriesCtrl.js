import category from "../models/Category.js";
import product from "../models/Product.js";

export const registerCategoryCtrl = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new category({
      name,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}