const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const sanitizeHtml = require("sanitize-html");
const template = require("./lib/template");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (request, response, next) => {
  fs.readdir("./data", (error, filelist) => {
    request.list = filelist;
    next();
  });
});

app.get("/", (request, response) => {
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
    `<a href="/create">create</a>`
  );
  response.send(html);
});

app.get("/page/:pageId", (request, response) => {
  const filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
    const title = request.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ["h1"]
    });
    const list = template.list(request.list);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
    );
    response.send(html);
  });
});

app.get("/create", (request, response) => {
  const title = "WEB - create";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
    ""
  );
  response.send(html);
});

app.post("/create_process", (request, response) => {
  const post = request.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", err => {
    response.redirect(`/page/${title}`);
  });
});

app.get("/update/:pageId", (request, response) => {
  const filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
    const title = request.params.pageId;
    const list = template.list(request.list);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    );
    response.send(html);
  });
});

app.post("/update_process", (request, response) => {
  const post = request.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, error => {
    fs.writeFile(`data/${title}`, description, "utf8", err => {
      response.redirect(`/page/${title}`);
    });
  });
});

app.post("/delete_process", (request, response) => {
  const post = request.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, error => {
    response.redirect("/");
  });
});

app.listen(port);
