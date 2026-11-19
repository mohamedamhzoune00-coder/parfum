const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  variant: {
    ml: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'الكمية خاصها تكون 1 على الأقل'],
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    // معلومات الزبون (بلا تسجيل)
    customer: {
      fullName: {
        type: String,
        required: [true, 'الاسم الكامل مطلوب'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'المدينة مطلوبة'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'العنوان مطلوب'],
        trim: true,
      },
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'خاص على الأقل منتج واحد فالطلبية',
      },
    },

    total: {
      type: Number,
      required: true,
      min: [0, 'المجموع ماينفعش يكون سالب'],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      enum: ['cod', 'transfer'],
      default: 'cod', // الدفع عند الاستلام
    },

    notes: {
      type: String,
      trim: true,
    },

    orderNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// إنشاء رقم الطلبية أوتوماتيكي
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `PZ-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
