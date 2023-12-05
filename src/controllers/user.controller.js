const db = require("../models");
const User = db.user;
const Comment = db.comment;
const fs = require("fs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.getProfileImage = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const profileImagePath = user.profileImg;

    if (!profileImagePath) {
      return res.status(404).json({ error: "Imagen de perfil no encontrada" });
    }

    fs.readFile(profileImagePath, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener la imagen de perfil" });
      }

      res.setHeader("Content-Type", "image/jpeg"); // Formato de la imagen

      res.end(data);
    });
  } catch (error) {
    console.error("Error al obtener la imagen de perfil:", error);
    res.status(500).json({ error: "Error al obtener la imagen de perfil" });
  }
};

exports.visitProfile = (req, res) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const userId = req.params.id;

  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
};

exports.uploadProfileImg = (req, res) => {
  const userId = req.params.userId;
  const profileImagePath = req.file.path;

  User.update({ profileImg: profileImagePath }, { where: { id: userId } })
    .then((result) => {
      if (result[0] === 1) {
        res.json({ message: "Imagen de perfil actualizada correctamente" });
      } else {
        res
          .status(500)
          .json({ error: "Error al actualizar la imagen de perfil" });
      }
    })
    .catch((error) => {
      console.error("Error al actualizar la imagen de perfil:", error);
      res
        .status(500)
        .json({ error: "Error al actualizar la imagen de perfil" });
    });
};

exports.searchUsersByUsername = (req, res) => {
  const username = req.query.username;
  db.users
    .findAll({
      where: {
        username: username,
      },
    })
    .then((users) => {
      res.json(users);
      console.log(res.json(users));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Ocurrió un error al buscar usuarios." });
    });
};

exports.updateUsername = (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Usuario no encontrado.",
        });
      }

      user
        .update({ username })
        .then(() => {
          res.send({message:"Nombre de usuario actualizado", username});
          Comment.update({ username }, { where: { username } }).then(() => {
            res.send({message: "Username de Comment actualizado"})
          }).catch((error) => {
            res.status(500).send({
              message: "Error al actualizar el nombre de usuario en la tabla Comment.",
              error: error.message,
            });
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error al actualizar el nombre de usuario en la tabla User.",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Error al buscar el usuario.",
        error: error.message,
      });
    });
};

exports.updateEmail = async (req, res) => {
  const { userId } = req.params;
  const { newEmail } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.email = newEmail;
    await user.save();

    return res
      .status(200)
      .json({ message: "Correo electrónico actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el correo electrónico:", error);
    return res
      .status(500)
      .json({
        message: "Ocurrió un error al actualizar el correo electrónico",
      });
  }
};

exports.updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.comparePassword(oldPassword)) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    } 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({ message: "Ocurrió un error al actualizar la contraseña" });
  }
};

