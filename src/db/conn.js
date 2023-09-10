const mongoose = require("mongoose");
const DB =
  "mongodb+srv://usama:usama123@cluster0.epjvvxf.mongodb.net/customhtml?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection start"))
  .catch((error) => console.log(error.message));