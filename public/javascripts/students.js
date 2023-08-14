//** GET COUNTRY CODE *****/
$(document).ready(() => {
  $(".country").on("input", async function () {
    let keyword = $(this).val().trim().toLowerCase();
    const loclaData = checkInLocalStorage("countryCode");
    if (loclaData.isExists) {
      //Get country code from localstorage
      const countries = loclaData.data;
      for (let country of countries) {
        if (country.name.toLowerCase().indexOf(keyword) != -1) {
          const dialCode = country.dial_code;
          $(".code").html(dialCode);
        }
      }
    } else {
      const request = {
        type: "GET",
        url: "../CountryCodes.json",
      };
      const res = await ajax(request);
      localStorage.setItem("countryCode", JSON.stringify(res));
    }
  });
});

//******* ADD STUDENT *******/
$(document).ready(() => {
  $("#student-form").submit(async function (e) {
    e.preventDefault();
    const token = getToken("authToken");

    let formData = new FormData(this);
    formData.append("token", token);

    const request = {
      type: "POST",
      url: "/students",
      data: formData,
      isLoader: true,
      commonBtn: ".add-student-btn",
      loaderBtn: ".student-loader",
    };
    try {
      const response = await ajax(request);
      $("#student-modal").modal("hide");
    } catch (error) {
      $(".student-email").addClass(
        "animate__animated animate__shakeX border border-danger"
      );
      $(".student-email").click(function () {
        $(this).removeClass(
          "animate__animated animate__shakeX border border-danger"
        );
        $(this).val("");
      });
    }
  });
});

//****** FECTH || SHOW STUDENTS DETAILS *******/
$(document).ready(() => {
  let from = 0;
  let to = 5;
  showStudents(from, to);
});
//show students function def
const showStudents = async (from, to) => {
  const request = {
    type: "GET",
    url: `students/${from}/${to}`,
  };
  const response = await ajax(request);
  if (response.data.length > 0) {
    for (let student of response.data) {
      let tr = `
        <tr>
          <td class='text-nowrap'>
            <div class='d-flex align-items-center'>
              <i class="fa fa-user-circle" style="font-size:45px;"></i>
              <div>
                <p class='p-0 m-0 text-capitalize fw-bold'>${student.studentName}</p>
                <small class='text-uppercase'>${student.studentCountry}</small>
              </div>
            </div>
          </td>
          <td class='text-nowrap'>${student.studentEmail}</td>
          <td class='text-nowrap'>${student.studentMobile}</td>
          <td class='text-nowrap'>${student.studentFather}</td>
          <td class='text-nowrap'>${student.studentDob}</td>
          <td class='text-nowrap'>${student.studentCountry}</td>
          <td class='text-nowrap'>${student.studentState}</td>
          <td class='text-nowrap'>${student.studentPin}</td>
          <td class='text-nowrap'>${student.studentAddress}</td>
          <td class='text-nowrap'>
            <span class='badge badge-danger'>Pending...</span>
          </td>
          <td class='text-nowrap'>${student.updatedAt}</td>
          <td class='text-nowrap'>
          
          </td>
        </tr>
      `;
      $(".student-list").append(tr);
    }
  } else {
    swal("Not Found!", "Not found any Students!", "warning");
  }
};

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
    $.ajax({
      type: request.type,
      url: request.url,
      data: request.type == "GET" ? {} : request.data,
      processData: request.type == "GET" ? true : false,
      contentType: request.type == "GET" ? "application/json" : false,
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
    });
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
