const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ReturnDocument,
  ObjectId,
} = require("mongodb");
const port = process.env.PORT || 5000;

require("dotenv").config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.an5qsbu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoriesCollection = client
      .db("readershub")
      .collection("categories");

    const usersCollection = client.db("readershub").collection("users");

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoriesCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}

run().catch();
app.get("/", (req, res) => {
  res.send("readers hub running");
});

app.listen(port, () => {
  console.log("readers server running on", port);
});
