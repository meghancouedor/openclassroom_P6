const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//On configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  //On indique d'enregistrer les fichiers dans le dossier Images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    //Création du file name
    callback(null, name + Date.now() + "." + extension);
  },
});

//Exportation du middleware
module.exports = multer({ storage: storage }).single("image");
