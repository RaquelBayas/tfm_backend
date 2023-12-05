const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("nodemailer");
require("dotenv").config();
var randtoken = require("rand-token");
var flash = require("express-flash");

const connection = require("../connection");
const User = db.user;
const Role = db.role;
const ResetPasswordToken = db.resetPasswordToken;

const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      profileImg: "",
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "Usuario registrado correctamente" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "Usuario registrado correctamente" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ message: "No se ha encontrado el usuario" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Contraseña inválida",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.secret,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    return res.status(200).json({ auth_token: token });

    /*return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });*/
  } catch (error) { 
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    res.clearCookie("token"); // Elimina la cookie 'token'
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};

exports.getUsernameByID = (req, res) => {
  const id = req.params.id;
  User.findOne({
    where: { id: id },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({ username: user.username });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error al obtener el username", error: error });
    });
};

exports.getUserByUsername = (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";
  User.findOne({ where: { username: req.params.username } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "No se ha encontrado el usuario" });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUsername = (req, res) => {
  const username = req.params.username;

  User.findOne({ where: { username } })
    .then((user) => {
      if (user) {
        res.send({ available: false }); //Nombre de usuario en uso
      } else {
        res.send({ available: true }); //Nombre de usuario disponible
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Nombre de usuario no disponible." });
    });
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.forgotPassword = (req, res) => {
  var email = req.body.email;
  console.log("forgot");
  ResetPasswordToken.create({ email, token })
    .then((resetToken) => {
      sendEmail(email, resetToken.token);

      res.status(200).json({
        success: true,
        message:
          "El enlace de restablecimiento de contraseña se ha enviado por correo electrónico.",
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message:
          "Ha ocurrido un error al generar el enlace de restablecimiento de contraseña.",
      });
    });
};

function generateResetToken() {
  const token = jwt.sign({}, config.secret, {
    expiresIn: "8h",
  });
  return token;
}

function sendEmail(email, token) {
  var email = email;
  var token = token;

  var mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password Link - MyList",
    html:
      '<p>Has solicitado reestablecer tu contraseña, accede al siguiente enlace: <a href="http://localhost:4200/reset-password?token=' +
      token +
      '">link</a> para reestablecer la contraseña/p>',
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(1);
    } else {
      console.log(0);
    }
  });
}

exports.updatePassword = async (req, res) => {
  var token = req.body.token;
  var password = req.body.password;

  connection.query(
    'SELECT * FROM users WHERE token ="' + token + '"',
    function (err, result) {
      if (err) throw err;
      var type;
      var msg;

      if (result.length > 0) {
        var saltRounds = 10;
        // var hash = bcrypt.hash(password, saltRounds);
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            var data = {
              password: hash,
            };

            connection.query(
              'UPDATE users SET ? WHERE email ="' + result[0].email + '"',
              data,
              function (err, result) {
                if (err) throw err;
              }
            );
          });
        });

        type = "success";
        msg = "Tu contraseña se ha actualizado correctamente";
      } else {
        type = "success";
        msg = "Ha ocurrido un error, inténtalo de nuevo";
      }

      req.flash(type, msg);
      res.redirect("/");
    }
  );
};

exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
      return res.status(200).json({ message: "La contraseña es válida" });
    } else {
      return res.status(401).json({ message: "La contraseña es inválida" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al verificar la contraseña" });
  }
};
