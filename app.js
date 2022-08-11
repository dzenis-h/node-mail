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
    "https://dzenis-h.com",
    "https://dzenis-h-contact.appspot.com/form-data"
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

    res.status(200).json({ msg: "Email has been sent" });
  });

});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log("Server started..."));
