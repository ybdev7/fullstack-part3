const express = require("express");
const cors = require("cors");
const app = express();

var morgan = require("morgan");
morgan.token("post-data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

/**log for every request method different than POST */
app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

/** log for POST method */
app.use(
  morgan(
    function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens["post-data"](req, res),
      ].join(" ");
    },
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

const PORT = process.env.PORT || 3001;
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
    number: "39-23-6423175",
  },
  {
    id: 6,
    name: "Mary Poppen",
    number: "39-23-6423167",
  },
  {
    id: 7,
    name: "Mary Poppen",
    number: "39-23-6423177",
  },
  {
    id: 8,
    name: "Mary Poppen",
    number: "39-23-6423178",
  },
];

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
/**
 * 3.5 and 3.6
 */
app.post(`/${API_URL}/${PERSONS_URL}`, (req, res) => {
  const id = Math.round(Math.random() * 1000000000);

  if (!req.body.name) {
    return res.status(400).json({ error: "name missing" });
  } else if (!req.body.number) {
    return res.status(400).json({ error: "number missing" });
  } else if (doesNameExist(req.body.name)) {
    return res.status(422).json({ error: "name must be unique" });
  }

  const person = { id: id, name: req.body.name, number: req.body.number };
  persons = persons.concat(person);

  console.log(`Added person ${person.name}`);
  res.json(person);
});

const doesNameExist = (name) => {
  const found = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
  return found;
};

/**3.4 */
app.delete(`/${API_URL}/${PERSONS_URL}/:id`, (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
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
