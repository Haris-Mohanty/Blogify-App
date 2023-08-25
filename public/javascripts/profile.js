$(document).ready(function () {
  $(".toggler").click(() => {
    const state = $(".sidenav").hasClass("sidenav-open");
    if (state) {
      //Nav Controll
      $(".sidenav").removeClass("sidenav-open");
      $(".sidenav").addClass("sidenav-close");

      //Section Controll
      $(".section").removeClass("section-open");
      $(".section").addClass("section-close");
    } else {
      //Nav Controll
      $(".sidenav").addClass("sidenav-open");
      $(".sidenav").removeClass("sidenav-close");

      //Section Controll
      $(".section").addClass("section-open");
      $(".section").removeClass("section-close");
    }
  });
});

//***** SHOW COMPANY INFO *******/
$(document).ready(() => {
  const token = getToken("authToken"); //student.js file(getToken)
  const companyObj = decodeToken(token); //common.js(decodeToken)
  const companyInfo = companyObj.data.companyInfo;
  $("company-email").html(companyInfo.email);
  $("company-name").html(companyInfo.name);
  $("company-mobile").html(companyInfo.mobile);
});
