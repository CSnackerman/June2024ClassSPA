import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import pizzas from "./routers/pizzas.js";

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
  res.send({ status: "healthy" });
});

app.use("/pizzas", pizzas);

app.listen(PORT, () => console.log("listening on port", PORT));
