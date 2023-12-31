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
  getPaginationList();
});
//show students function def
const showStudents = async (from, to) => {
  $(".student-list").html("");
  const request = {
    type: "GET",
    url: `students/${from}/${to}`,
    isLoader: true,
    commonBtn: ".tmp",
    loaderBtn: ".students-skeleton",
  };
  const response = await ajax(request);
  let currentStudents = JSON.stringify(response.data);
  if (response.data.length > 0) {
    //data store in session storage for pdf export
    sessionStorage.setItem("current-student", currentStudents);

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
    let id = "";
    let tr = "";
    let allEditBtn = $(".edit-student");
    for (let btn of allEditBtn) {
      btn.onclick = function () {
        tr = this.parentElement.parentElement.parentElement;
        id = $(this).data("id");
        updateStudent(tr);
        const studentString = $(this).data("student");
        const studentData = studentString.replace(/'/g, '"');
        const getStudent = JSON.parse(studentData);

        for (let key in getStudent) {
          let value = getStudent[key];
          $(`[name=${key}]`, "#student-form").val(value);
        }

        $(".add-student-btn").addClass("d-none");
        $(".update-student-btn").removeClass("d-none");
        $(".update-student-btn").attr("data-id", id);
        $("#student-modal").modal("show");
      };
    }
  });
  //****** SHARE STUDENT (to email) ******/
  $(document).ready(() => {
    //modal open & show link
    $(".share-student").each(function () {
      $(this).click(function () {
        let studentId = $(this).data("id");
        let studentEmail = $(this).data("email");
        $("#share-email-btn").attr("data-email", studentEmail);
        let link = `${window.location}/invitation/${studentId}`;
        $(".link").val(link);
        $("#share-modal").modal("show");
      });
    });
  });
  //Copy link
  $(document).ready(() => {
    $("#copy-btn").click(function () {
      $(".link").select();
      document.execCommand("copy");
      $("i", this).removeClass("fa fa-copy");
      $("i", this).addClass("fa fa-check");
      setTimeout(() => {
        $("i", this).removeClass("fa fa-check");
        $("i", this).addClass("fa fa-copy");
      }, 2000);
    });
  });
  //Send Email
  $(document).ready(() => {
    $("#share-email-btn").click(async function () {
      const studentEmail = this.getAttribute("data-email");
      const token = getToken("authToken");
      const tokenData = decodeToken(token);
      const company = tokenData.data.companyInfo;

      const receipt = {
        to: studentEmail,
        subject: "Share Link!",
        message: "Thank You!",
        companyName: company.company,
        companyEmail: company.email,
        companyMobile: company.mobile,
        companyLogo: company.logoUrl,
        inviationLink: $(".link").val(),
      };
      let formData = new FormData();
      formData.append("token", token);
      formData.append("receipt", JSON.stringify(receipt));
      const request = {
        type: "POST",
        url: "/sendMail",
        data: formData,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".progress-loader",
      };
      try {
        const res = await ajax(request);
        $("#share-modal").modal("hide");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

//******* UPDATE STUDENT CODE ******/
const updateStudent = (oldTr) => {
  $(".update-student-btn").click(async function (e) {
    e.preventDefault();
    let id = this.getAttribute("data-id");
    const token = getToken("authToken");
    const form = document.querySelector("#student-form");
    let formData = new FormData(form);
    formData.append("token", token);
    formData.append("updatedAt", new Date());
    const request = {
      type: "PUT",
      url: "/students/" + id,
      data: formData,
      isLoader: true,
      commonBtn: ".update-student-btn",
      loaderBtn: ".student-loader",
    };
    try {
      const response = await ajax(request);
      const students = response.data;
      const tr = dynamicTR(students);

      //update data(live update)
      const updateTD = $(tr).html();
      $(oldTr).html(updateTD);
      oldTr = "";
      $(".add-student-btn").removeClass("d-none");
      $(".update-student-btn").addClass("d-none");
      $("#student-modal").modal("hide");
      $(form).trigger("reset");

      //edit btn working
      studentAction();
    } catch (err) {
      console.log(err);
    }
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
            <p class='p-0 m-0 text-capitalize fw-bold'>${
              student.studentName
            }</p>
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
      <td class='text-nowrap'>${formatDate(student.createdAt)}</td>
      <td class='text-nowrap'>
        <div class='d-flex'>
         <button data-student="${studentData}" data-id='${
    student._id
  }' class='btn edit-student icon-btn-primary'>
            <i class='fa fa-edit'></i>
         </button>
         <button data-id='${
           student._id
         }' class='btn delete-student icon-btn-danger mx-2'>
            <i class='fa fa-trash'></i>
         </button>
         <button data-id='${student._id}' data-email='${
    student.studentEmail
  }' class='btn share-student icon-btn-info'>
            <i class='fa fa-share'></i>
         </button>
        </div>
      </td>
    </tr>
  `;
  return tr;
};
//Date formating
const formatDate = (dateStr) => {
  let date = new Date(dateStr);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  dd < 10 ? (dd = "0" + dd) : (dd = dd);
  mm < 10 ? (mm = "0" + mm) : (mm = mm);

  return dd + "-" + mm + "-" + yy + " " + date.toLocaleTimeString();
};

//********* PAGINATION CODE *****/
const getPaginationList = async () => {
  let i;
  const request = {
    type: "GET",
    url: "/students/count-all",
  };
  const res = await ajax(request);
  const totalStudent = res.data;
  let length = totalStudent / 5;
  let skipData = 0;

  if (length.toString().indexOf(".") != -1) {
    length = length + 1;
  }
  for (i = 1; i <= length; i++) {
    let button = `
      <button data-skip=${skipData} class="border btn-design paginate-btn ${
      i == 1 ? "active" : ""
    }">
        <i>${i}</i>
      </button>
    `;
    $("#student-pagination").append(button);
    skipData = skipData + 5;
  }
  getPaginationData();
};
const getPaginationData = () => {
  $(".paginate-btn").each(function (index) {
    $(this).click(function () {
      controlPrevAndNext(index);
      removeClass(".paginate-btn", "active");
      $(this).addClass("active");
      let skip = $(this).data("skip");
      showStudents(skip, 5);
    });
  });
};

//next btn code
$(document).ready(function () {
  $("#next").click(function () {
    let currentIndex = 0;
    $(".paginate-btn").each(function () {
      if ($(this).hasClass("active")) {
        currentIndex = $($(this)).index();
      }
    });
    $(".paginate-btn")
      .eq(currentIndex + 1)
      .click();
    controlPrevAndNext(currentIndex + 1);
  });
});
//prev btn code
$(document).ready(function () {
  $("#prev").click(function () {
    let currentIndex = 0;
    $(".paginate-btn").each(function () {
      if ($(this).hasClass("active")) {
        currentIndex = $($(this)).index();
      }
    });
    $(".paginate-btn")
      .eq(currentIndex - 1)
      .click();
    controlPrevAndNext(currentIndex - 1);
  });
});
const controlPrevAndNext = (currentIndex) => {
  const totalBtn = $(".paginate-btn").length - 1;
  if (currentIndex == totalBtn) {
    $("#next").attr("disabled", true);
    $("#prev").attr("disabled", false);
  } else if (currentIndex > 0) {
    $("#prev").attr("disabled", false);
    $("#next").attr("disabled", false);
  } else {
    $("#next").attr("disabled", false);
    $("#prev").attr("disabled", true);
  }
};

//******** FILTER || SEARCH STUDENT (BY NAME, EMAIL, MOBILE) ******/
$(document).ready(() => {
  $(".filter").on("input", function () {
    let keyword = $(this).val().trim().toLowerCase();
    let tr = $(".student-list tr");
    $(tr).each(function () {
      let allTd = this.querySelectorAll("TD");
      let allName = allTd[0].querySelector("P").innerHTML;
      let email = allTd[1].innerHTML;
      let mobile = allTd[2].innerHTML;
      if (allName.toLowerCase().indexOf(keyword) != -1) {
        $(this).removeClass("d-none");
      } else if (email.toLowerCase().indexOf(keyword) != -1) {
        $(this).removeClass("d-none");
      } else if (mobile.toString().indexOf(keyword) != -1) {
        $(this).removeClass("d-none");
      } else {
        $(this).addClass("d-none");
      }
    });
  });
});

//********* EXPORT DATA INTO PDF ********/
$(Document).ready(() => {
  $("#current").click(async function (e) {
    e.preventDefault();
    let currentStudents = sessionStorage.getItem("current-student");
    if (currentStudents != null) {
      let token = getToken("authToken");
      let formData = new FormData();
      formData.append("data", currentStudents);
      formData.append("token", token);

      const request = {
        type: "POST",
        url: "/export-to-pdf",
        data: formData,
      };
      try {
        let response = await ajax(request);
        const downloadReq = {
          type: "GET",
          url: "/exports/" + response.filename,
        };
        const pdfRes = await ajaxDownloader(downloadReq);
        const pdfUrl = URL.createObjectURL(pdfRes);
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = response.filename;
        a.click();
        a.remove();
        deletePdf(response.filename);
      } catch (error) {
        console.log(error);
      }
    } else {
      swal("Not Found!", "Students Found Error!", "error");
    }
  });
});

//***** DELETE PDF *******/
const deletePdf = async (filename) => {
  const token = getToken("authToken");
  const request = {
    type: "DELETE",
    url: "/export-to-pdf/" + filename,
    data: {
      token: token,
    },
  };
  const res = await ajax(request);
  console.log(res);
};

//******* GET ALL STUDENT *******/
$(document).ready(() => {
  $("#all").click(async function (e) {
    e.preventDefault();
    const token = getToken("authToken");
    const company = decodeToken(token);
    const companyId = company.data.companyInfo._id;
    const Studentsreq = {
      type: "GET",
      url: "/students/all/" + companyId,
    };
    const res = await ajax(Studentsreq);
    const allStudents = JSON.stringify(res.data);
    let formData = new FormData();
    formData.append("data", allStudents);
    formData.append("token", token);

    const request = {
      type: "POST",
      url: "/export-to-pdf",
      data: formData,
    };
    try {
      let response = await ajax(request);
      const downloadReq = {
        type: "GET",
        url: "/exports/" + response.filename,
      };
      const pdfRes = await ajaxDownloader(downloadReq);
      const pdfUrl = URL.createObjectURL(pdfRes);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = response.filename;
      a.click();
      a.remove();
      deletePdf(response.filename);
    } catch (error) {
      console.log(error);
    }
  });
});
