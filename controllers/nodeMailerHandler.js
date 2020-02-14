"use strict";

const nodemailer = require("nodemailer");

function nodeMailerHandler(senderName, senderEmail, senderMessage) {
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.CB_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.CB_USER,
        pass: process.env.CB_PASS
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `RelayMail by CodeBee <${process.env.CB_USER}>`, // sender address
      to: process.env.CB_USER, // list of receivers
      subject: "👋 Hello Catalin, I'm " + senderName, // Subject line
      //text: senderMessage, // plain text body
      html: `<body style="background: #eeeeee; padding: 0 20px 20px 20px">
                  <div 
                    style="
                      font-family: monospace, helvetica, arial, sans-serif;
                      color: #2d303a; 
                      overflow: hidden;">
                    <h1 id="newMessage" 
                        style="
                          color: #653bfb;
                          font-size: 26px">
                          New email from ${senderName} 🙂
                    </h1>
                    <p id="contactEmail">
                      <b style="font-size: 18px">&#9993; </b>
                          ${senderEmail}
                    </p>
                    <hr>
                    <p id="contactMessage" style="word-wrap: break-word; font-size: 16px">
                      ${senderMessage}
                    </p>
                  </div>
            </body>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
}

module.exports = nodeMailerHandler;
