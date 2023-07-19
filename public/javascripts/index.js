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
$(document).ready((e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "api/signup",
    data: {
      name: Haris,
    },
    success: function (response) {
      console.log(response);
    },
  });
});
