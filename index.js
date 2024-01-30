const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3001;
const API_URL = "api";
const PERSONS_URL = "persons";

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mary Poppen",
    number: "39-23-6423177",
  },
];
app.get("/", (req, res) => {
  res.send("<p>Service running...</p>");
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has information for ${
      persons?.length
    } people.</br>${new Date().toString()}</p>`
  );
});

app.get(`/${API_URL}/${PERSONS_URL}`, (req, res) => {
  res.json(persons);
});

app.get(`/${API_URL}/${PERSONS_URL}/:id`, (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.statusMessage = "Person not found";
    res.status(404).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
