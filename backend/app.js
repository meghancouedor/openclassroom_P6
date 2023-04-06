const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

//Installation et connexion à Mongoose
mongoose
  .connect(
    "mongodb+srv://meghancouedor:ZbXNjF7Qmx5bxRhC@cluster0.f1yakf9.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Déclaration des routes
const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

app.use(express.json());

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Enregistrement des routes
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

//Exportation de l'application
module.exports = app;
