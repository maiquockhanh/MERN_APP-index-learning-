const express = require("express");
const app = express();
require("dotenv").config();
require("./database");

const userRouter = require("./routes/user");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
