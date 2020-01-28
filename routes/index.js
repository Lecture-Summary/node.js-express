const express = require("express");
const router = express.Router();
const template = require("../lib/template");

function authIsOwner(request, response) {
  if (request.session.is_logined) {
    return true;
  } else {
    return false;
  }
}

function authStatusUI(request, response) {
  let authStatusUI = "<a href='/auth/login'>login</a>";
  if (authIsOwner(request, response)) {
    authStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
  }

  return authStatusUI;
}

router.get("/", (request, response) => {
  const title = "Welcome";
  const description = "Hello, Node.js";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
    `<a href="/topic/create">create</a>`,
    authStatusUI(request, response)
  );
  response.send(html);
});

module.exports = router;
