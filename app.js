const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
// app.use(express.static(__dirname + "/"));
app.use(express.static('public'))


app.set("trust proxy", true);

// Enable CORS
app.use((req, res, next) => {
  // Allow multiple predefined origins
  const allowedOrigins = [
    "https://reactive-portfolio.web.app",
    "reactive-portfolio.firebaseapp.com",
    "dzenis-h.com",
    "www.dzenis-h.com",
    "https://dzenis-h.com"
  ];

  const origin = req.headers.origin; // extract the origin from the header
  if (allowedOrigins.indexOf(origin) > -1) {
    // if the origin is present
    res.setHeader("Access-Control-Allow-Origin", origin); // set the CORS header to it
  }

  // Alternatively, you can accept all requests simply by uncommenting the following line of code:
  // res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log("Server started..."));
