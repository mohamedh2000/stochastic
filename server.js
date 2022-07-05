require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3001;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_DB_URI;
const cors = require("cors");
const bodyParser = require("body-parser");
var fileupload = require("express-fileupload");
const { allowedNodeEnvironmentFlags } = require("process");
app.use(fileupload());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/allFiles", (req, res) => {
  try {
    client.connect(async (err) => {
      let db = client.db("UserFiles").collection("Files");
      let results = db.find({});
      let retArr = await results.toArray();
      res.status(200).send({ results: retArr });
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

app.post("/upload", (req, res) => {
  let fileToUpload = req.files.file;
  let fileDate = req.body.date;
  const fileOptions = { file: fileToUpload, upload_date: fileDate };

  if (fileOptions.file == null || fileDate == null) {
    res.status(400);
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    client.connect(async (err) => {
      let db = client.db("UserFiles").collection("Files");
      let checkDuplicates = db.find({ "file.name": {$regex: fileToUpload.name}});
      let duplicates = await checkDuplicates.toArray();
      if (duplicates.length != 0) {
        let tempNameArr = fileOptions["file"]["name"].split(".");
        tempNameArr[0] += `(${duplicates.length})`;
        fileOptions["file"]["name"] = tempNameArr.join(".");
      }
      let ret = await db.insertOne(fileOptions);
      res.status(200).send(ret);
    });
  } catch (e) {
    res.status(500);
  }
});

app.get("/getDoc/:id", (req, res) => {
  try {
    if (req.params.id == null) {
      res.status(400);
    }
    let mongo = require("mongodb");
    let o_id = mongo.ObjectID(req.params.id);
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    client.connect(async (err) => {
      let db = client.db("UserFiles").collection("Files");
      let doc = db.find({ _id: o_id });
      res.status(200).send(await doc.toArray());
    });
  } catch (e) {
    res.status(500);
  }
});

app.listen(port, () => console.log(`Listening on Port: ${port}`));
