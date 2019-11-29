const express = require("express");

const server = express();
server.use(express.json());
server.listen(3000);

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkIdProjectExists(req, res, next) {
  const id = req.params.id;

  if (projects.findIndex((proj) => proj.id === id) == -1) {
    console.log("nao achei");
    return res
      .status(400)
      .json({ error: "id project not found on request params" });
  }
  return next();
}

const projects = [];

server.post("/projects", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const project = { id, title };
  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIdProjectExists, (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  const index = projects.findIndex((proj) => proj.id === id);
  if (projects[index].tasks == undefined) {
    projects[index].tasks = [];
  }
  projects[index].tasks.push(title);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.send(projects);
});

server.put("/projects/:id", checkIdProjectExists, (req, res) => {
  const id = req.params.id;
  const index = projects.findIndex((proj) => proj.id === id);
  projects[index].title = req.body.title;

  return res.send(projects);
});

server.delete("/projects/:id", checkIdProjectExists, (req, res) => {
  const id = req.params.id;
  const project = projects.filter((project) => project.id === id);
  projects.splice(project.id, 1);

  return res.send(projects);
});
