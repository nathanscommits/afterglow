const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require('mongodb');
const uri = process.env.CONNECTIONSTRING;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("Connection established - All well");
  // const db = client.db('classrooms');
  module.exports = client
  const app = require("./app");
  app.listen(process.env.PORT || 80);
});


// mongodb.connect(
//   process.env.CONNECTIONSTRING,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, client) {
//     console.log("connecting to DB");
//     module.exports = client;
//     const app = require("./app");
//     app.listen(process.env.PORT || 80);
//   }
//   );
  // const app = require("./app");
  // app.listen(process.env.PORT || 80);
