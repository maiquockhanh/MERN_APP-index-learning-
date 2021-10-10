const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./database");

const userRouter = require("./routes/user");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
