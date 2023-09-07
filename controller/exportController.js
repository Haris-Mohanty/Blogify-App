const tokenService = require("../services/tokenService");
const pdfKit = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");

const pdf = async (req, res) => {
  const random = crypto.randomBytes(4).toString("hex");
  const pdfFile = "public/exports/" + random + ".pdf";
  const commingData = req.body;
  const pdfData = JSON.parse(commingData.data);

  //Token verification
  let token = await tokenService.verifyToken(req);
  const company = token.data.companyInfo;
  if (token.isVerified) {
    //Create pdf
    const doc = new pdfKit({
      margin: 30,
      page: "A4",
    });

    //Create table
    const table = {
      title: "Students Data",

      headers: [
        {
          label: "Name",
          property: "name",
        },
        {
          label: "Email",
          property: "email",
        },
        {
          label: "FName",
          property: "father",
        },
        {
          label: "Mobile",
          property: "mobile",
        },
        {
          label: "Address",
          property: "address",
        },
        {
          label: "Joined At",
          property: "joinedAt",
        },
      ],
      datas: [],
    };
    for (let data of pdfData) {
      table.datas.push({
        name: data.studentName,
        email: data.studentEmail,
        father: data.studentFather,
        mobile: data.studentMobile,
        address: data.studentAddress,
        joinedAt: data.createdAt,
      });
    }

    //path
    doc.pipe(fs.createWriteStream(pdfFile));

    //Add font size
    doc.fontSize(20);

    //Add header
    doc.text(company.company, {
      align: "center",
    });

    //Add some space(Margin)
    doc.moveDown(2);

    //Data in pdf
    doc.table(table);

    //End pdfkit
    doc.end();

    //Response
    res.status(200).json({
      message: "Success",
      filename: random + ".pdf",
    });
  } else {
    res.status(401).json({
      message: "Permission Denied at PDF!",
    });
  }
};

//******** DELETE PDF *******/
const deletePdf = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    let filename = "public/exports/" + req.params.filename;
    fs.unlinkSync(filename);
    res.status(200).json({
      message: "Deleted Successfully!",
    });
  } else {
    res.status(401).json({
      message: "Permission Denied at Delete PDF!",
    });
  }
};

module.exports = {
  pdf: pdf,
  deletePdf: deletePdf,
};
