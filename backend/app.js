//Installation Express
const express = require("express");

const app = express();

//Installation et connexion Mongoose
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://meghancouedor:ZbXNjF7Qmx5bxRhC@cluster0.f1yakf9.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Importation des routes
const userRoutes = require("./routes/user");

//Enregistrement des routes
app.use("/api/auth", userRoutes);

module.exports = app;
