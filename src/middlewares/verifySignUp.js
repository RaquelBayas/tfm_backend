const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Se ha producido un error. Nombre de usuario no disponible.",
      });
    }

    // Email
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(400).send({
        message:
          "Se ha producido un error. El correo electrónico está asociado a otro usuario.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message:
            "Se ha producido un error. No existe el rol = " + req.body.roles[i],
        });
        return;
      }
    }
  }
  next();
};

checkUsernameAvailability = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Se ha producido un error. Nombre de usuario no disponible.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkUsernameAvailability,
};

module.exports = verifySignUp;
