const Sauce = require("../modeles/sauce");
const User = require("../modeles/user");
const fs = require("fs");

//Création de sauces
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
  // on utilise le modele mangoose et la methode findOne pour trouver un objet via la comparaison req.params.id
  Sauce.findOne({ _id: req.params.id })
    // status 200 OK et l'élément en json
    .then((sauce) => res.status(200).json(sauce))
    // si erreur envoit un status 404 Not Found et l'erreur en json
    .catch((error) => res.status(404).json({ message: "Non OK !" }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  //Vérification si un fichier est déjà existant
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        // ImageUrl représente http://localhost:3000/images/imageNom par défaut
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  console.log("image modifiée = ", req.file);
  // Cherche la sauce correspondant à l'iD de l'url dans la DB
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log("image modifiée = ", req.file);
      // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejetée
      if (sauce.userId != req.auth.userId) {
        res
          .status(401)
          .json({ message: "Non autorisé(e) à modifier cette sauce !" });
        // Si l'image a été modifiée on supprime celle anciennement utilisée
      } else if (req.file != undefined) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //Mise à jour de l'objet
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Sauce modifiée, nouvelle photo active !" })
            )
            .catch((error) => res.status(401).json({ error }));
        });
        // Si l'image n'a pas été modifiée, on change uniquement les données
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({
              message: "Sauce modifiée, la photo n'a pas été changée !",
            })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  //Identification de la sauce à supprimer
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Si je ne suis pas le propriétaire de la sauce, je ne peux pas la supprimer
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        //Récupération de l'adresse de l'image
        const fileToDestroy = sauce.imageUrl.split("/images/")[1];
        //Suppression du fichier
        fs.unlink(`images/${fileToDestroy}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée " }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//Récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Like/Dislike une sauce
exports.likeSauce = (req, res, next) => {
  //Création des variables
  const like = req.body.like;
  const userId = req.auth.userId;

  if (like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "j'aime la sauce" }))
      .catch((error) => res.status(500).json({ error }));
  }
  //Si l'utilisateur dislike la sauce
  else if (like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "j'aime pas la sauce" }))
      .catch((error) => res.status(500).json({ error }));
  } else if (like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //si l'utilisateur est enregistré dans le tableau userLiked
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: userId },
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "utilisateur supprimé de l'array" })
            )
            .catch((error) => res.status(500).json({ error }));
        }

        //si l'utilisateur est enregistré dans le tableau userDisliked
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: userId },
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "utilisateur supprimé de l'array" })
            )
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }
};
