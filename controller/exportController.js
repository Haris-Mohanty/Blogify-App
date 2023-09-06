const tokenService = require("../services/tokenService");
const pdfKit = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");
const random = crypto.randomBytes(4).toString("hex");

const pdf = async (req, res) => {
  const pdfFile = "public/exports/" + random + ".pdf";
  const commingData = req.body;
  const pdfData = JSON.parse(commingData.data);
  console.log(pdfData);

  //Token verification
  let token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    //Create pdf
    const doc = new pdfKit({
      margin: 30,
      page: "A4",
    });

    //path
    doc.pipe(fs.createWriteStream(pdfFile));

    //Data in pdf
    doc.text("Students Data!");

    //End pdfkit
    doc.end();

    //Response
    res.status(200).json({
      message: "Success",
    });
  } else {
    res.status(401).json({
      message: "Permission Denied at PDF!",
    });
  }
};

module.exports = {
  pdf: pdf,
};
