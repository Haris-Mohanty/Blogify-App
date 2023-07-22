const ajax = require("supertest");

const postRequest = async (req) => {
  const response = await ajax(req.endPoint) //end point
    .post(req.api) //api
    .send({ token: req.data }); //data

  return response.body;
};

module.exports = { postRequest: postRequest };
