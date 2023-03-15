const mongoose = require("mongoose");

//Installation de mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

//Création du modèle utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
