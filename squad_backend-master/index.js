// This file contains port details and code to all backend routing.

const express = require("express");
var cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello from server!" });
});

app.use("/login", require("./routes/login"));
app.use("/forgot-password", require("./routes/forgot-password"));
app.use("/change-password", require("./routes/change-password"));
app.use("/addstore", require("./routes/addstore"));
app.use("/getstores", require("./routes/getstores"));
app.use("/getstore", require("./routes/getstore"));
app.use("/updatestore", require("./routes/updatestore"));
app.use("/deletestore", require("./routes/deletestore"));
app.use("/getitems", require("./routes/getitems"));
app.use("/getitem", require("./routes/getitem"));
app.use("/additem", require("./routes/additem"));
app.use("/updateitem", require("./routes/updateitem"));
app.use("/deleteitem", require("./routes/deleteitem"));
app.use("/search", require("./routes/search"));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
