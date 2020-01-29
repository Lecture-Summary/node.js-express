const express = require("express");
const router = express.Router();
const path = require("path");
const template = require("../lib/template");

const authData = {
  email: "egoing777@gmail.com",
  password: "111111",
  nickname: "egoing"
};

router.get("/login", (request, response) => {
  const title = "WEB - login";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `
        <form action="/auth/login_process" method="post">
          <p><input type="text" name="email" placeholder="email"></p>
          <p><input type="password" name="pwd" placeholder="password"></p>
          <p>
            <input type="submit" value="login">
          </p>
        </form>
      `,
    ""
  );
  response.send(html);
});

router.post("/login_process", (request, response) => {
  const post = request.body;
  const email = post.email;
  const pwd = post.pwd;
  if (email === authData.email && pwd === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(() => {
      response.redirect(`/`);
    });
  } else {
    response.send("Who?");
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy(err => {
    response.redirect("/");
  });
});

module.exports = router;
