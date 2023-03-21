const Sauce = require("../modeles/sauces");

//Création de sauces
exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
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
      //Récupération de l'adresse de l'image
      const filename = sauce.imageUrl.split("/images/")[1];
      //Suppression du fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//Récupération d'une sauce

//Récupération de toutes les sauces

//Like/Dislike une sauce
