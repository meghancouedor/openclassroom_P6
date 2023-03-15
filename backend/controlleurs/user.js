//Installation du package de criptage pour les mots de passe
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../modeles/user");

exports.signup = (req, res, next) => {
  // Fonction asynchrone renvoyant une Promise qui reçoit le hash généré
  //Hash du mot de passe (10 tours suffisent à le sécuriser)
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //Création d'un nouvel utilisateur
      const newUser = new user({
        email: req.body.email,
        password: hash,
      });
      //Enregistrement de l'utilisateur dans la base de données
      newUser
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Fonction qui vérifie si l'utilisateur est bien enregistré dans la base de données, vérification du mdp et possibles cas d'erreurs
exports.login = (req, res, next) => {
  newUser
    .findOne({ email: req.body.email })
    //Récupération de l'enregistrement dans la base de données & vérification si l'utilisateur a été trouvé + si le mdp est bien le bon
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Identifiant/Mot de passe incorrects." });
      } else {
        //Comparaison du mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Identifiant/Mot de passe incorrects." });
            } else {
              //Si le mdp est correct
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  //Clé secrète pour l'encodage
                  "RANDOM_TOKEN_SECRET",
                  //Application d'une expiration
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    //Si il y a des erreurs d'exécution de requêtes
    .catch((error) => {
      res.status(500).json({ error });
    });
};
