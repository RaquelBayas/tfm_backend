const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/user');


// Middleware para verificar el token de autenticación
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
  
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1];
      req.token = token;
      next();
    } else {
      res.sendStatus(403);
    }
  }

router.post('/signup', (req,res) => {
    let users = req.body;
    query = "select username,email,password,role from users where email=?"
    connection.query(query,[users.email],(err,results)=>{
        if(!err) {
            if(results.length <= 0 ) {
                query = "insert into users(username,email,password,role) values (?,?,?,'user')"
                connection.query(query,[users.username,users.email,users.password],(err,results)=> {
                    if(!err) {
                        return res.status(200).json({message: "Successfully registered"});
                    } else {
                        return res.status(500).json({message: 'error + '+err});
                    }
                })
            }else {
                return res.status(400).json({message: "Email already exists"});
            }
        }
        else {
            return res.status(500).json({message: 'error + '+err});
        }
    })
});

/*
router.get('/users:email', async (req,res) =>{
    console.log("req users:email: ",req);
    try {
        const user = await User.findOne({ where: {email: req.params.email  }});
        //console.log(user);
        //if(user) {
        //    return res.status(200).json({username: user.username});
        //}
        console.log("try");
    } catch(err) {
    
        throw err;
    }
});*/

router.get('/users:username', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        // Si el usuario ya existe, devolver un error 409 (conflicto)
        return res.status(409).json({ message: 'El nombre de usuario ya está registrado' });
      } else {
        // Si el usuario no existe, devolver un código 200 (OK) y un mensaje indicando que el nombre de usuario está disponible
        return res.status(200).json({ message: 'El nombre de usuario está disponible' });
      }
    } catch (err) {
      // Si ocurre algún error al buscar el usuario, devolver un error 500 (error interno del servidor)
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para obtener la información del usuario
//router.get('/user', verifyToken, (req, res) => {
//    const userId = req.token.sub; // Supongamos que el token contiene el ID del usuario
//    console.log("userId: ",userId);
    //const user = db.getUser(userId); // Supongamos que esto devuelve el objeto del usuario
//    return res.json({ username: userId });
//});
router.get('/user', (req, res) => {
    const email = req.query.email;
        console.log('api users email ',email);
  // Realizar la consulta SELECT a la tabla users
  connection.query(`SELECT username FROM users WHERE email = '${email}'`, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el username del usuario' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      return res.json(results[0]);
    }
  });
});

/*router.get('/users/', (req, res) => {
    query = "select * from users";
    connection.query(query, (error, results) => {
        if (error) throw error;
    
        res.json(results);
      });
});
*/
router.post('/login',(req,res) => {
    const user = req.body;
    query = "select email, password, username, role from users where email=?";
    console.log("user: ",req.body);
    connection.query(query,[user.email],(err,results)=>{

        if(!err) {
            console.log("results:",results[0]);
            if(results[0].length <= 0 || results[0].password != user.password){
                return res.status(401).json({message: "Incorrect Username or password"});
            } else if(results[0].password == user.password) {

                const response = {email: results[0].email, role: results[0].role};
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN, {expiresIn:'8h'});
                return res.status(200).json({token:accessToken});
            } else {
                return res.status(400).json({message: "Something went wrong"});
            }
        } else {
            console.log("error 500");
            return res.status(500).json(err);
        }
    });
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req,res)=> {
    const user = req.body;
    query = "select email, password from users where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err) {
            if(results.length <= 0) {
                return res.status(200).json({message: "Password sent successfully to your email"});
            } else {
                let emailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by MyList Management System',
                    html: '<p><b>Login details for MyList Managemente System</b><br><b>Email</b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200">Click here to login</a></p>'
                };
                transporter.sendMail(emailOptions,function(error,info) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: '+info.response);
                    }
                });
                return res.status(200).json({message: "Password sent successfully to your email"});
            }
        } else {
            return res.results(500).json(err);
        }
    })
})


module.exports = router;