

const config = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
  params: {
    Bucket: "docs.haris.com",
  },
};
const s3 = new AWS.S3(config);

//****** CHECK DATA IN LOCAL STORAGE *****/
const checkInLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    let tmp = JSON.parse(localStorage.getItem(key));
    return {
      isExists: true,
      data: tmp,
    };
  } else {
    return {
      isExists: false,
    };
  }
};

//**** AJAX REQUEST ******/
const ajax = (request) => {
  return new Promise((resolve, reject) => {
    let options = {
      type: request.type,
      url: request.url,
      beforeSend: () => {
        if (request.isLoader) {
          $(request.commonBtn).addClass("d-none");
          $(request.loaderBtn).removeClass("d-none");
        }
      },
      success: function (response) {
        if (request.isLoader) {
          $(request.commonBtn).removeClass("d-none");
          $(request.loaderBtn).addClass("d-none");
        }
        resolve(response);
      },
      error: function (error) {
        if (request.isLoader) {
          $(request.commonBtn).removeClass("d-none");
          $(request.loaderBtn).addClass("d-none");
        }
        reject(error);
      },
    };

    if (request.type == "POST" || request.type == "PUT") {
      options["data"] = request.data;
      options["processData"] = false;
      options["contentType"] = false;
    }

    if (request.type == "DELETE") {
      options["data"] = request.data;
    }

    $.ajax(options);
  });
};

//***** GET TOKEN FROM COOKIE *****/
const getToken = (cookieName) => {
  const allCookie = document.cookie;
  let cookies = allCookie.split(";");
  let cookieValue = "";
  for (let cookie of cookies) {
    let currentCookie = cookie.split("=");
    if (currentCookie[0] == cookieName) {
      cookieValue = currentCookie[1];
    }
  }
  return cookieValue;
};

//******* SWAL CONFIRMATION *******/
const confirm = (message) => {
  return new Promise((resolve, reject) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        resolve(true);
        swal(`Poof! Your imaginary file has been ${message}!`, {
          icon: "success",
        });
      } else {
        reject(false);
        swal("Your imaginary file is safe!");
      }
    });
  });
};

//****** REMOVE CLASS ****/
const removeClass = (element, className) => {
  $(element).each(function () {
    $(this).removeClass(className);
  });
};

//****** DECODE TOKEN *******/
const decodeToken = (token) => {
  let payload = JSON.parse(atob(token.split(".")[1]));
  return payload;
};

//****** UPLOAD FILE ON S3 ******/
const uploadFileOnS3 = async (file) => {
  const fileInfo = {
    Key: file.name,
    Body: file,
    ACL: "public-read",
  };
  try {
    const res = await s3.upload(fileInfo).promise();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
