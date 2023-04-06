const express = require("express");

const router = express.Router();

// Importation du middleware auth pour sécuriser les routes
const auth = require("../middleware/auth");

//Importation du middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controlleurs/sauce");

//Lien des routes
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
