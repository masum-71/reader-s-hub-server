const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ReturnDocument,
  ObjectId,
} = require("mongodb");
const { query } = require("express");
const port = process.env.PORT || 5000;

require("dotenv").config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.an5qsbu.mongodb.net/?retryWrites=true&w=majority`;

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
    const bookingsCollection = client.db("readershub").collection("bookings");
    const reportCollection = client.db("readershub").collection("reports");

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

    app.put("/categories", async (req, res) => {
      const product = req.body;
      const category = req.body.category;
      const query = { category: category };
      const options = { upsert: true, new: true };
      const updateDoc = {
        $push: {
          products: product,
        },
      };
      const result = await categoriesCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const email = req.query.email;

      const query = { products: { $elemMatch: { email } } };
      const result = await categoriesCollection.find(query).toArray();

      const products = [];
      result.forEach((category) => {
        const product = category.products.filter(
          (product) => product.email === email
        );
        products.push(...product);
      });

      // const products = result.map((category) =>
      //   category.products.filter((product) => product.email === email)
      // );

      res.send(products);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.userRole === "buyer" });
    });
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.userRole === "seller" });
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.userRole === "admin" });
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/report", async (req, res) => {
      const report = req.body;
      const result = await reportCollection.insertOne(report);
      res.send(result);
    });

    app.get("/report", async (req, res) => {
      const query = {};
      const result = await reportCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/report/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await reportCollection.deleteOne(query);
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
