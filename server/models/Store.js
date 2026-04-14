import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    shopName: {
      type: String,
      required: [true, 'Please add a shop name'],
      trim: true,
      maxlength: [100, 'Shop name cannot be more than 100 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Store', storeSchema);
