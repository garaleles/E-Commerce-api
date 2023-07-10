import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Ürün adı alanı boş geçilemez'],
      maxlength: [100, 'Ürün adı 100 karakterden fazla olamaz'],
    },
    price: {
      type: Number,
      required: [true, 'Lütfan ürün fiyatı giriniz'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Ürün açıklaması boş geçilemez.'],
      maxlength: [1000, 'Ürün açıklaması 1000 karakterden fazla olamaz.'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Lütfen bir kategori seçiniz.'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Lütfen bir marka seçiniz.'],
    },
    colors: {
      type: [String],
      required: true,
    },

    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      required: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//ProductSchema.virtual('reviews', {
  //ref: 'Review',
  //localField: '_id',
  //foreignField: 'product',
 // justOne: false,
//});

//ProductSchema.pre('remove', async function (next) {
 // await this.model('Review').deleteMany({ product: this._id });
//});

export default mongoose.model('Product', productSchema);

