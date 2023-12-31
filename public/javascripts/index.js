//******* REDIRECT USER TO PROFILE PAGE IF ALREADY LOGGED *******/
if (document.cookie.indexOf("authToken") != -1) {
  window.location = "/students";
}

//****** Request Login Modal ******/
$(document).ready(() => {
  $("#login-modal-req").click((e) => {
    e.preventDefault();
    $("#signup-modal").modal("hide");
    $("#login-modal").modal("show");
  });
});
//****** Request Signup Modal ******/
$(document).ready(() => {
  $("#signup-modal-req").click((e) => {
    e.preventDefault();
    $("#login-modal").modal("hide");
    $("#signup-modal").modal("show");
  });
});

//******* SIGNUP REQUEST  ********/
$(document).ready(() => {
  $("#signup-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/signup",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: function () {
        $(".before-send").removeClass("d-none");
        $(".signup-btn").addClass("d-none");
      },
      success: function (response) {
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");

        if (response.isUserCreated) {
          $(".signup-btn").addClass("bg-success disabled");
          $(".signup-btn").html("Redirecting to Profile page...");
          setTimeout(() => {
            window.location = "/students";
          }, 4000);
        }
      },
      error: function (error) {
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");
        const errorRes = error.responseJSON;
        if (error.status == 409) {
          //Handle Error(show err message)
          const label = "." + errorRes.message.label;
          const field = "." + errorRes.message.field;
          $(field).addClass("border border-danger");
          $(field + "-error").html(label);
          //Remove message
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else {
          swal("500", "Internal Server Error!", "warning");
        }
      },
    });
  });
});

//******* LOGIN REQUEST  ********/
$(document).ready(() => {
  $("#login-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/login",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: function () {
        $(".before-send").removeClass("d-none");
        $(".login-btn").addClass("d-none");
      },
      success: function (response) {
        $(".before-send").addClass("d-none");
        $(".login-btn").removeClass("d-none");
        if (response.islogged) {
          window.location = "/students";
        }
      },
      error: function (error) {
        //Handle Error(show err message)
        $(".before-send").addClass("d-none");
        $(".login-btn").removeClass("d-none");
        if (error.status == 404) {
          const field = ".username";
          $(".username").addClass("border border-danger");
          $(".username-error").html("User Not Found!");
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else if (error.status == 401) {
          const field = ".password";
          $(".password").addClass("border border-danger");
          $(".password-error").html("Wrong Password!");
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else if (error.status == 406) {
          const field = ".password";
          $(".password").addClass("border border-danger");
          $(".password-error").html(error.responseJSON.message);
          setTimeout(() => {
            resetValidator(field);
          }, 6000);
        } else {
          FileSystemWritableFileStream(
            error.status,
            "internal Server Error!",
            "error"
          );
        }
      },
    });
  });
});

//Remove message
const resetValidator = (field) => {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
};
