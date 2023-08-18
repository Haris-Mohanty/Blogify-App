const tokenService = require("../services/tokenService");
const dataBase = require("../services/database");

//***** CREATE STUDENTS || ADD STUDENT DATA *******/
const create = async (req, res) => {
  //Token Verify
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const data = req.body;
    data["companyId"] = tokenData.data.uid;
    //data insert in database
    try {
      const dataRes = await dataBase.createRecord(data, "studentSchema");
      res.status(200).json({
        message: "Record Created!",
        data: dataRes,
      });
    } catch (err) {
      res.status(409).json({
        message: "Error in Create Student API!",
        error: err,
      });
    }
  } else {
    res.status(401).json({
      message: "Permission Denied!",
    });
  }
};

//****** FETCH STUDENT DETAILS  *******/
const countStudent = async (req, res) => {
  //Token Verify
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const dataRes = await dataBase.countData("studentSchema");
    res.status(200).json({
      data: dataRes,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized User!",
    });
  }
};

//****** PAGINATE (SHOW STUDENT DETAILS) ********/
const paginate = async (req, res) => {
  //Token Verify
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    let from = Number(req.params.from);
    let to = Number(req.params.to);
    const dataRes = await dataBase.paginateData(from, to, "studentSchema");
    res.status(200).json({
      data: dataRes,
    });
  } else {
    res.status(401).json({
      message: "Error in Paginate API!",
    });
  }
};

//************ DELETE STUDENTS ***********/
const deleteStudents = async (req, res) => {
  //token verify
  const tokenData = await tokenService.verifyToken(req);
  if (tokenData.isVerified) {
    const id = req.params.id;
    const deleteRes = await dataBase.deleteById(id, "studentSchema");
    res.status(200).json({
      data: deleteRes,
    });
  } else {
    res.status(401).json({
      message: "Error in Delete Student API!",
    });
  }
};

//******** UPDATE STUDENTS ******/
const updateStudents = () => {};

module.exports = {
  create: create,
  countStudent: countStudent,
  paginate: paginate,
  deleteStudents: deleteStudents,
  updateStudents:updateStudents
};
