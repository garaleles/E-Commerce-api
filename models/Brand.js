import mongoose from 'mongoose';



const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [100, 'Marka adı 100 karakterden fazla olamaz.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },

  { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
