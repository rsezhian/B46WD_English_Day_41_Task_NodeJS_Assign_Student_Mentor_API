//
const express = require("express");
const app = express();
const port = 4001;
const dbconnection = require("./dbcon/connection.js");
const router = require("./routes/router.js");

//
//
//
app.use(express.json());
app.use(router);

//
//
//
//
//
app.listen(port, () => {
  console.log(`Server is listening on the Port: ${port}`);
});
