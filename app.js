const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require("body-parser");
const nodemailer    = require('nodemailer');
const app           = express();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'free.tony.bologna.@gmail.com',
      pass: 'luck65pwns'
  }
});

let PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
});

app.post('/', (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: 'invalid request: no data in POST body' });
    return;
  }

  // setup email data with unicode symbols
  let mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`, // sender address
    to: 'anthony.langford@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: `${req.body.message}`, // plain text body
    html: '<b>Hello world ?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

});

app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});