import express, { response } from "express";
import logger from "morgan";
import PhoneBook from "./mongo.js";

const app = express();
//app.use(express.static("dist"));

app.use(express.json());
logger.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(logger(":method :url :status :body"));

/*
let phoneNumbers = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },

  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },

  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },

  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
*/

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/api/phonenumbers", (request, response) => {
  PhoneBook.find({}).then((results) => {
    console.log("results!!!: ", results);
    response.send(results);
  });
});

app.get("/api/phonenumbers/:id", (request, response, next) => {
  const id = request.params.id;
  PhoneBook.findById(id)
    .then((results) => {
      console.log(results);
      if (results) {
        response.json(results);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/info", (request, response) => {
  let numbers = 0;
  PhoneBook.find({})
    .then((results) => {
      numbers = results.length;
      console.log("numbers: ", numbers);
      const d = new Date();
      response.send(
        `<p>Phonebook has info for ${numbers} people </p> <p>${d}</p>`
      );
    })
    .catch((error) => {
      console.log(error, error.name);
    });
});

app.post("/api/phonenumbers", (request, response, next) => {
  const body = request.body;
  console.log("body: ", body);
  let log;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (!body.id) {
    const id = String(Math.floor(Math.random() * 1000));

    log = new PhoneBook({
      id: id,
      name: body.name,
      number: body.number,
    });
  } else {
    log = new PhoneBook({
      id: body.id,
      name: body.name,
      number: body.number,
    });
  }

  console.log("log: ", log);

  log
    .save()
    .then((result) => {
      console.log("log saved to database", log);
      response.send(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/phonenumbers/:id", (request, response, next) => {
  const id = request.params.id;
  console.log(id);

  PhoneBook.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/phonenumbers/:id", (request, response, next) => {
  const { name, number } = request.body;
  console.log("serverissä id: ", request.body._id);
  console.log("params id: ", request.params.id);
  PhoneBook.findById(request.params.id)
    .then((bookListing) => {
      if (!bookListing) {
        return response.status(404).end();
      }

      bookListing.name = name;
      bookListing.number = number;

      return bookListing.save().then((updatedBookListing) => {
        response.json(updatedBookListing);
      });
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
