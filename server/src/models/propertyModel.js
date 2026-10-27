const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedRooms: {
      type: Number,
      required: true,
    },
    bathRooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "rented", "inactive"],
      default: "available",
    },
  },
  { timestamps: true },
);

// Reuse existing model if already compiled, otherwise create a new one
module.exports =
  mongoose.models.Property || mongoose.model("Property", propertySchema);