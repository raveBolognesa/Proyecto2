const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Productschema = new Schema({
  name: String,
  description: String,
  rating: String,
  author: String,
  lat: Number,
  lng: Number,
  Pos: String,
  imgPath: String,
  imgName: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Product = mongoose.model('Product', Productschema);
module.exports = Product;
