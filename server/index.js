import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { DB_URL, PORT } from "./libs/data.js";
import router from "./Routes/userRoutes.js";

const app = express()
app.use(express.json());

app.use(cors())


app.use('/api',router);


app.get("/", (req, res) => {
    res.send("<h1>🚀 Server is Running ...</h1>");
  });

  connect(DB_URL, { dbName: "TaskWeb" })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });