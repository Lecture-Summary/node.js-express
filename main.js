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

const authData = {
  email: "egoing777@gmail.com",
  password: "111111",
  nickname: "egoing"
};

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("serializeUser", user);
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser", id);
  done(null, authData);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd"
    },
    function(username, password, done) {
      console.log("LocalStrategy", username, password);
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          return done(null, authData);
        } else {
          console.log(3);
          return done(null, false, {
            message: "Incorrect password."
          });
        }
      } else {
        console.log(4);
        return done(null, false, {
          message: "Incorrect username."
        });
      }
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
