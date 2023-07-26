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
        console.log(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});

//Remove message
const resetValidator = (field) => {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
};
