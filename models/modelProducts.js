const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Productschema = new Schema({
  name: String,
  description: String,
  kcal: Number,
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  lat: Number,
  lng: Number,
  Pos: String,
  typeFood: {
            type: String, 
            enum: ['Americana','China', 'Española', 'India', 'Italiana', 'Japonesa', 'Turca', 'Mexicana']
            },  
  vegan: Boolean,
  veget: Boolean,
  ingredients: Array,
  comments: Array,
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
