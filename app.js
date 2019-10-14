const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const keys = require("./config/keys");

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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.render("index.html");
// });

// Getting the form-data from React
app.post("/form-data", (req, res) => {
  let output = `
  <div style='font-family: Verdana, Geneva, Tahoma, sans-serif; background-color: #e5e5e5;
  text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.726); margin: .5rem; border: 2px solid #000; 
  border: 2px solid #e2e234;'>

  <b style='padding: .5rem; color: #444; font-weight: bold;'
  >You have a new contact request</b> <br>
  
  <h3 style='padding: .6rem; color: #e2e234; background: #444;'>Contact Details:</h3>
  <div>
  <ul style='list-style-type: square;'>  
      <li>Name: <span style='font-weight: bold; color: #444'>${req.body.formData.name}</span></li>
      <li>Company: <span style='font-weight: bold; color: #444'>${req.body.formData.company}</span></li>
      <li>Email: <span style='font-weight: bold; color: #444'>${req.body.formData.email}</span></li>
      <li>Phone: <span style='font-weight: bold; color: #444'>${req.body.formData.phone}</span></li>
  </ul>
  </div>
    <h3 style='padding: .6rem; color: #e2e234; background: #444;'>Message:</h3>
    <p style='background-color: #e5e5e5; margin: .6rem;'>
    ${req.body.formData.message}</p>
    </div>
    `;

  // GOOGLE
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: keys.user,
        pass: keys.pass
      },
      tls: {
        rejectUnauthorized: false // Not safe for production
      }
    })
  );

  // Setup email data with unicode symbols
  let mailOptions = {
    from: req.body.formData.email, // sender address
    to: "contact.dzenis.h@gmail.com", // list of receivers
    subject: "Contact Form", // Subject line
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

const port = process.env.PORT || 5050;

app.listen(port, () => console.log("Server started..."));
