const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const authRouter = require("./routes/auth");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(helmet());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (request, response, next) => {
  fs.readdir("./data", (error, filelist) => {
    request.list = filelist;
    next();
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd"
    },
    function(username, password, done) {
      console.log("LocalStrategy", username, password);
      /*       User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      }); */
    }
  )
);

app.post(
  "/auth/login_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
  })
);

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port);
