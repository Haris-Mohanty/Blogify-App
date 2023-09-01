const tokenService = require("../services/tokenService");
const pdfKit = require("pdfkit-table");
const fs = require("fs");

const pdf = async (req, res) => {
  let token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    //Create pdf
    const doc = new pdfKit({
      margin: 30,
      page: "A4",
    });

    //path
    doc.pipe(fs.createWriteStream("public/exports/new.pdf"));

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
