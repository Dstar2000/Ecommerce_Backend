import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    shopName: {
      type: String,
      required: function () {
        return this.role === 1; // Only required for shop owners
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
