const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controlleurs/sauces");

//Lien des routes
router.post("/", auth, multer, saucesCtrl.createSauces);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.get("/:id", auth, saucesCtrl.oneSauce);
router.get("/", auth, saucesCtrl.allSauces);

module.exports = router;
