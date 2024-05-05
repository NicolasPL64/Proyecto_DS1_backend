require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

var mensaje = {
    from: "TEST <" + process.env.NODEMAILER_EMAIL + ">",
    to: "",
    subject: "Manzanas",
    text: "2Eres tú",
    html: "<p>2fíjate <b>tú</b>.</p>",
};

console.log('Credentials obtained, sending message a' + mensaje.from);
transporter.sendMail(mensaje, (err, info) => {
    if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
    }
    console.log('Message sent: %s', info.messageId);
});