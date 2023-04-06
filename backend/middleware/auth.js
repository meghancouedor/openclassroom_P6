//Vérification de la validité du token

//Importation de json web token
const jwt = require("jsonwebtoken");

//Exportation du middleware
module.exports = (req, res, next) => {
  //Récupération du token
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
