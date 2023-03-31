const Sauce = require("../modeles/sauces");

//Création de sauces
exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log("Hello");
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Nouvelle sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  //Vérification si un fichier est déjà existant
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //Mise à jour de l'objet
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Suppression de sauces
exports.deleteSauce = (req, res, next) => {
  //Identification de la sauce à supprimer
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Si je ne suis pas le propriétaire de la sauce, je ne peux pas la supprimer
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        //Récupération de l'adresse de l'image
        const filename = sauce.imageUrl.split("/images/")[1];
        //Suppression du fichier
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Récupération d'une sauce
exports.oneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Récupération de toutes les sauces
exports.allSauces = (req, res, next) => {
  console.log("Hello2");
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Like/Dislike une sauce

exports.likeSauce = (req, res, next) => {
  //Création des variables
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  //Si l'utilisateur like la sauce
  if (like === 1) {
    Sauce.updateOne(
      //Recherche de la sauce par son id
      { _id: sauceId },
      {
        $push: { usersLiked: userId },
        $inc: { likes: like },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous avez aimé cette sauce !" })
      )
      .catch((error) => res.status(500).json({ error }));
  }

  //Si l'utilisateur dislike la sauce
  else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $push: { usersDisliked: userId },
        $inc: { dislikes: 1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous n’aimez pas cette sauce" })
      )
      .catch((error) => res.status(500).json({ error }));
  } else {
    //Si un utilisateur dislike ou relike
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        //L'utilisateur veut enlever son like
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => {
              res.status(200).json({ message: "Sauce dislikée" });
            })
            .catch((error) => res.status(500).json({ error }));
          // L'utilisateur re-like la sauce
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => {
              res.status(200).json({ message: "Sauce likée" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
