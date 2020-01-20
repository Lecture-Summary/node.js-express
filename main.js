const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const template = require("./lib/template");
const topicRouter = require("./routes/topic");

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

app.use("/topic", topicRouter);

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
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
});

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port);
