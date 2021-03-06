const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComentSchema = Schema({
  name: String,
  path: String,
  originalName: String,
  referenceId: String,
  creatorId: String,
  postId: String
});

const Coment = mongoose.model("Coment", ComentSchema);

module.exports = Coment;
