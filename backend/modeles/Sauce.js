const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

//Objet représentant les différents champs dont le schéma a besoin
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [String] },
  usersDisliked: { type: Array, default: [String] },
});

sauceSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model("Sauce", sauceSchema);
