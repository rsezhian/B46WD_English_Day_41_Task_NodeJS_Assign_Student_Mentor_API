//
const mongoose = require("mongoose");
let dbcon =
  "mongodb+srv://abcd:abcd@cluster0.57fajnv.mongodb.net/assign-student-mentor";
mongoose
  .connect(dbcon, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));
