const express = require("express");
const router = express.Router();
const userControlleur = require("../controlleurs/user");

//On utilise router.get ou router.post
router.post("/signup", userControlleur.signup);
router.post("/login", userControlleur.login);

module.exports = router;
