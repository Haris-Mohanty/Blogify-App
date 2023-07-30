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

        if (response.isCompanyCreated) {
          //Redirect to Profile Page
        } else {
          //Handle Error(show err message)
          const label = "." + response.message.label;
          const field = "." + response.message.field;
          $(field).addClass("border border-danger");
          $(field + "-error").html(label);
          //Remove message
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        }
      },
      error: function (error) {
        console.log(error);
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
          window.location = "/profile";
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
        } else {
          FileSystemWritableFileStream(
            error.status,
            "internal Server Error1",
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
