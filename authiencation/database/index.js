const mongoose = require("mongoose");

const URI =
  "mongodb+srv://admin:9uQwqK5itmQDxxS9@cluster0.jg2sb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err));
