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

app.use(express.json());

//Enregistrement des routes
app.use("/api/auth", userRoutes);

module.exports = app;
