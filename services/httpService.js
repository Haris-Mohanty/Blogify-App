const ajax = require("supertest");

const postRequest = (req) => {
  ajax(req.endPoint) //end point
    .post(req.api) //api
    .send({ token: req.data }) //data
    .end((err, dataRes) => {
    //   console.log(dataRes);
    });
};

module.exports = { postRequest: postRequest };
