const express = require("express");
const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!validate(id)) {
    return response.status(404).json({
      error: 'Id is invalid',
    })
  }

  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(404).json({
      error: "Repository not found"
    });
  }

  const { url, title, techs } = request.body;
  repository.url = url;
  repository.title = title;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: "Repository not found"
    });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: "Repository not found"
    });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({
    likes
  });
});

module.exports = app;
