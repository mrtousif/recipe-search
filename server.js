const path = require("path");
const express = require("express");

const app = express();

// serve static files
app.use(express.static(path.join(__dirname, "dist")));

app.use("/", (req, res, next) => {
  res.sendFile("dist/index.html");
});

const port = process.env.PORT || 8000;

app.listen(port);
