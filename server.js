const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
const flash = require('express-flash');

app.use(flash());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(
  cookieSession({
    name: "rbd-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: "strict",
  })
);

// database
const db = require("./src/models");
const Role = db.role;
//initial();

/*db.sequelize.sync().then(() => {
  //initial();
});*/


//force: true will drop the table if it already exists
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
  initial();
});*/

app.get("/", (req, res) => {
  res.json({ message: "Welcome to movies application." });
});

require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/list.routes")(app);
require("./src/routes/review.routes")(app);
require("./src/routes/comment.routes")(app);
require("./src/routes/follower.routes")(app);
require("./src/routes/contact.routes")(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });
}
