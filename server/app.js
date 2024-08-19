import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// env

dotenv.config();

const { PORT = 4040, MONGODB = "" } = process.env;

// database (mongo)

mongoose.connect(MONGODB);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error:"));
db.once(
  "open",
  console.log.bind(console, "successfully opened connection to mongodb")
);

// init express app

const app = express();

// middleware

const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date().toLocaleString("en-US")}`);
  next();
};

app.use(cors);
app.use(logger);
app.use(express.json());

// routes

app.get("/status", (req, res) => {
  res.send(JSON.stringify({ status: "healthy" }));
});

app.get("/weather/:city", (request, response) => {
  const city = request.params.city;

  let cloudy = "clear";
  let rainy = false;
  let lowTemp = 32;

  if ("cloudy" in request.query) {
    cloudy = request.query.cloudy;
  }
  if ("rainy" in request.query && request.query.rainy === "true") {
    rainy = request.query.rainy;
  }
  if ("lowtemp" in request.query) {
    lowTemp = Number(request.query.lowtemp);
  }

  const min = 70;
  const max = 90;
  const temp = Math.floor(Math.random() * (max - min + 1) + min);

  response.status(418).json({
    text: `The weather in ${city} is ${temp} degrees today.`,
    cloudy: cloudy,

    rainy,
    temp: {
      current: temp,
      low: lowTemp,
    },
    city,
  });
});

app.listen(PORT, () => console.log("listening on port", PORT));
