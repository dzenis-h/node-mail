const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const creds = require("./config/credentials");

const app = express();

// Enable CORS
app.use((req, res, next) => {
  // Allow multiple specific origins
  const allowedOrigins = ["https://dzenis-h.com", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.set("view engine", "hbs");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Getting the form-data from React
app.post("/form-data", (req, res) => {
  let output = `
  <p>You have a new contact request</p>
  <h3>Contact Details:</h3>
  <ul>  
      <li>Name: ${req.body.formData.name}</li>
      <li>Company: ${req.body.formData.company}</li>
      <li>Email: ${req.body.formData.email}</li>
      <li>Phone: ${req.body.formData.phone}</li>
  </ul>
    <h3>Message:</h3>
    <p>${req.body.formData.message}</p>
  `;

  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: creds.user,
        pass: creds.pass
      },
      tls: {
        rejectUnauthorized: false // Not safe for production
      }
    })
  );

  // Setup email data with unicode symbols
  let mailOptions = {
    from: `Contact Form - ${req.body.formData.email}`, // sender address
    to: creds.user, // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "", // plain text body
    html: output // html body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ msg: "Something went wrong!" });
    }
    console.log("Message sent: %s", info.messageId);

    res.status(200).send({ msg: "Email has been sent" });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server started..."));
