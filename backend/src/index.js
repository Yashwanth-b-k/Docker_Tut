// load environment variables from .env into process.env
require("dotenv").config(); // load .env (if present)
const express = require("express"); // import Express
const mongoose = require("mongoose"); // import Mongoose
const cors = require("cors"); // import CORS middleware

const app = express(); // create Express app
const PORT = process.env.PORT || 4000; // choose port (env or default)

app.use(cors()); // enable Cross-Origin requests
app.use(express.json()); // parse JSON request bodies

// MongoDB connection string (fall back to docker-compose service name 'mongo')
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/todos";

// connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch((err) => console.error("✖ MongoDB connection error:", err));

// define a tiny Todo schema
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true }, // todo text
    done: { type: Boolean, default: false }, // completion flag
  },
  { timestamps: true }
); // createdAt / updatedAt

const Todo = mongoose.model("Todo", todoSchema); // create model

// GET /api/todos -> return list of todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // newest first
    res.json(todos); // send JSON array
  } catch (err) {
    res.status(500).json({ error: "Server error" }); // simple error handling
  }
});

// POST /api/todos -> create a todo { text }
app.post("/api/todos", async (req, res) => {
  try {
    const todo = new Todo({ text: req.body.text }); // create document
    await todo.save(); // save to MongoDB
    res.status(201).json(todo); // return saved doc
  } catch (err) {
    res.status(400).json({ error: "Invalid data" }); // validation error
  }
});

// DELETE /api/todos/:id -> delete by id
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id); // delete doc
    res.sendStatus(204); // no content
  } catch (err) {
    res.status(400).json({ error: "Invalid id" }); // bad request
  }
});

// start server
app.listen(PORT, () => console.log(`🚀 Backend listening on port ${PORT}`));
