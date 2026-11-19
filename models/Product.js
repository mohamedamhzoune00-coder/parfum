const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    ml: {
      type: Number,
      required: [true, 'الحجم بالـ ml مطلوب'],
    },
    price: {
      type: Number,
      required: [true, 'الثمن مطلوب'],
      min: [0, 'الثمن ماينفعش يكون سالب'],
    },
    stock: {
      type: Number,
      required: [true, 'الكمية مطلوبة'],
      min: [0, 'الكمية ماتنفعش تكون سالبة'],
      default: 0,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'الماركة مطلوبة'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'الفئة مطلوبة'],
    },
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
      trim: true,
    },
    images: [
      {
        type: String, // URL ديال التصويرة
      },
    ],
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'خاص على الأقل variant واحد (حجم واحد)',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: أقل ثمن (باش نعرضوه فالـ storefront)
productSchema.virtual('startingPrice').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.min(...this.variants.map((v) => v.price));
});

module.exports = mongoose.model('Product', productSchema);
