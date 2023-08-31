const tokenService = require("../services/tokenService");
const pug = require("pug");
const AWS = require("aws-sdk");
const config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
const mailer = new AWS.SES(config);

const sendEmail = async (req, res) => {
  //verify token
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    let data = JSON.parse(req.body.receipt);

    //
    const emailInfo = {
      Destination: {
        ToAddresses: [data.to],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: data.subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: pug.renderFile(
              "C:/Users/haris/Desktop/Blogify App/views/email-template.pug",
              data
            ),
          },
        },
      },
      Source: "harismohanty8658@gmail.com",
    };
    try {
      await mailer.sendEmail(emailInfo).promise();
      res.status(200).json({
        message: "Email Sending Successfully!",
      });
    } catch (err) {
      res.status(424).json({
        message: "Sending Email Failed!",
      });
      console.log(err);
    }
  } else {
    res.status(401).json({
      message: "Error in send email API!",
    });
  }
};

module.exports = {
  sendEmail: sendEmail,
};
