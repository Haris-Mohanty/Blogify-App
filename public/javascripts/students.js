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
      //for live add
      const student = response.data;
      const tr = dynamicTR(student);
      $(".student-list").append(tr);

      //Activaing student action(delete, edit, share)
      studentAction();

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
    isLoader: true,
    commonBtn: ".tmp",
    loaderBtn: ".students-skeleton",
  };
  const response = await ajax(request);
  if (response.data.length > 0) {
    for (let student of response.data) {
      let tr = dynamicTR(student);
      $(".student-list").append(tr);
      studentAction();
    }
  } else {
    swal("Not Found!", "Not found any Students!", "warning");
  }
};

//****** ACTION (DELETE, EDIT & SHARE) *******/
const studentAction = () => {
  $(document).ready(() => {
    //DELETE STUDENT
    $(".delete-student").each(function () {
      $(this).click(async function () {
        //find parent
        const tr = this.parentElement.parentElement.parentElement;

        //get id
        const id = $(this).data("id");
        const token = getToken("authToken");
        const request = {
          type: "DELETE",
          url: "/students/" + id,
          data: {
            token: token,
          },
        };
        try {
          const isConfirm = await confirm("Deleted");
          if (isConfirm) {
            await ajax(request);
            tr.remove();
          }
        } catch (err) {
          console.log(err);
        }
      });
    });
  });
  //EDIT || UPDATE STUDENT
  $(document).ready(() => {
    $(".edit-student").each(function () {
      $(this).click(function () {
        const id = $(this).data("id");
        const studentString = $(this).data("student");
        const studentData = studentString.replace(/'/g, '"');
        const getStudent = JSON.parse(studentData);
        console.log(getStudent);
        $("#student-modal").modal("show");
      });
    });
  });
};

//******* DYNAMIC TABLE CREATE CODE *******/
const dynamicTR = (student) => {
  const studentString = JSON.stringify(student);
  let studentData = studentString.replace(/"/g, "'");
  let tr = `
    <tr class='animate__animated animate__fadeIn animate__slower'>
      <td class='text-nowrap'>
        <div class='d-flex align-items-center'>
          <i class="fa fa-user-circle mx-2" style="font-size:45px;"></i>
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
        <div class='d-flex'>
         <button data-student="${studentData}" data-id='${student._id}' class='btn edit-student icon-btn-primary'>
            <i class='fa fa-edit'></i>
         </button>
         <button data-id='${student._id}' class='btn delete-student icon-btn-danger mx-2'>
            <i class='fa fa-trash'></i>
         </button>
         <button data-id='${student._id}' class='btn share-student icon-btn-info'>
            <i class='fa fa-share'></i>
         </button>
        </div>
      </td>
    </tr>
  `;
  return tr;
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
