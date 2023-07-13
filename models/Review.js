import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'İncelemenin bir kullanıcıya ait olması gerekiyor'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'İncelemenin bir ürüne ait olması gerekiyor'],
    },
    message: {
      type: String,
      required: [true, 'Lütfen bir mesaj giriniz'],
    },
    rating: {
      type: Number,
      required: [true, 'Lütfen 1-5 arasında bir puan veriniz'],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Review', reviewSchema);
