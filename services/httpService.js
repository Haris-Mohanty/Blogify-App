const ajax = require("supertest");

const postRequest = async (req) => {
  const response = await ajax(req.endPoint) //end point
    .post(req.api) //api
    .send({ token: req.data }); //data

  return response.body;
};

const getRequest = async (req) => {
  const response = await ajax(req.endPoint) //end point
    .get(req.api + "/" + req.data) //api & data
    .set({ "X-Auth-Token": req.data }); //token

  return response.body;
};

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
};
