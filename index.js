import express, { response } from "express";
import logger from "morgan";
import { request } from "http";

const app = express();

app.use(express.json());
logger.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(logger(":method :url :status :body"));

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

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/phonenumbers", (request, response) => {
  response.json(phoneNumbers);
});

app.get("/api/phonenumbers/:id", (request, response) => {
  const id = request.params.id;
  const phoneNumber = phoneNumbers.find((phoneNumber) => phoneNumber.id === id);

  if (phoneNumber) {
    response.json(phoneNumber);
  } else {
    response.json(404);
  }
});

app.get("/info", (request, response) => {
  const numberOfPhonenumbers = phoneNumbers.length;
  const d = new Date();
  response.send(
    `<p>Phonebook has info for ${numberOfPhonenumbers} people </p> <p>${d}</p>`
  );
});

app.post("/api/phonenumbers", (request, response) => {
  let log;
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (phoneNumbers.find((item) => item.name === body.name)) {
    return response.status(400).json({
      error: "name already exists",
    });
  }

  if (!body.id) {
    const id = String(Math.floor(Math.random() * 1000));

    log = {
      id: id,
      name: body.name,
      number: body.number,
    };
  } else {
    log = {
      id: body.id,
      name: body.name,
      number: body.number,
    };
  }

  phoneNumbers = phoneNumbers.concat(log);

  response.json(phoneNumbers);
});

app.delete("/api/phonenumbers/:id", (request, response) => {
  const index = request.params.id;
  console.log(index);

  const phonenumber = phoneNumbers.find((number) => number.id == index);

  if (phonenumber) {
    phoneNumbers = phoneNumbers.filter((item) => {
      return item.id !== index;
    });

    response.json(phoneNumbers);
  } else {
    response.status(404).json({ message: "Phone number not found" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
