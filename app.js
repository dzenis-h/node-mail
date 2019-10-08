const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const creds = require("./config/credentials");

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "hbs");

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
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    res.status(500).json({ msg: "Email has been sent" });
  });
});

app.listen(5050, () => console.log("Server started..."));
