require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

var morgan = require("morgan");
morgan.token("post-data", (req, res) => {
  return JSON.stringify(req.body);
});

const logger = (request, response, next) => {
  console.log(
    ">>>",
    new Date().toLocaleString(),
    " Method:",
    request.method,
    " Path:  ",
    request.path,
    " Body:  ",
    request.body
  );
  console.log("<<<");
  next();
};

app.use(express.static("dist"));
app.use(express.json());
app.use(logger);
app.use(cors());

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

const PORT = process.env.PORT;
const API_URL = "api";
const PERSONS_URL = "persons";

app.get("/info", (req, res) => {
  Person.find({}).then((persons) =>
    res.send(
      `<p>Phonebook has information for ${persons.length} people.</br>
     ${new Date().toString()}</p>`
    )
  );
});

/**3.13 */
app.get(`/${API_URL}/${PERSONS_URL}`, (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});
/**
 * 3.5 and 3.6, 3.13
 */
app.post(`/${API_URL}/${PERSONS_URL}`, (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name missing" });
  } else if (!req.body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  Person.find({ name: { $regex: `${req.body.name}`, $options: "i" } }).then(
    (persons) => {
      console.log("found", persons.length, "persons named", req.body.name);
      if (persons && persons.length) {
        res.status(422).json({ error: "name must be unique" });
      } else {
        const person = new Person({
          name: req.body.name,
          number: req.body.number,
        });
        person.save().then((newPerson) => {
          console.log(`Added person ${person.name}`);
          res.json(newPerson);
        });
      }
    }
  );
});

/**3.4 , 3.13*/
app.delete(`/${API_URL}/${PERSONS_URL}/:id`, (req, res) => {
  const id = req.params.id;
  Person.deleteOne({ _id: id })
    .then((person) => res.status(204).end())
    .catch((ex) => {
      console.log(ex);
      res.status(204).end();
    });
});

app.get(`/${API_URL}/${PERSONS_URL}/:id`, (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else {
        res.statusMessage = "Person not found";
        res.status(404).end();
      }
    })
    .catch(
      (ex) => next(ex)
      // {
      //   console.log(ex);
      //   res.statusMessage = "Person not found";
      //   res.status(400).send({ error: "malformatted id" });
      // }
    );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error("!!", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
