const mongoose = require('mongoose');

const ProductMetadataSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  images: {
    type: [String], // Array of base64 encoded strings
    required: true,
  },
});

module.exports = mongoose.model('ProductMetadata', ProductMetadataSchema);