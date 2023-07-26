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
        console.log(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
