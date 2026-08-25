const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    phone: { type: String, required: true, unique: true },

    isAdmin: { type: Boolean, default: false },

    addresses: [addressSchema],
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// virtual id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema);