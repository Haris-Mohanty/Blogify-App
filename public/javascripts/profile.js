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
  $(".company-email").html(companyInfo.email);
  $(".company-name").html(companyInfo.company);
  $(".company-mobile").html(companyInfo.mobile);
});

//******* UPLOAD COMPANY LOGO ******/
$(document).ready(() => {
  $(".logo-box").click(() => {
    let imgType = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    let input = document.createElement("INPUT");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async function () {
      let file = this.files[0];
      //show upload loader
      $(".uploader").removeClass("d-none");
      $(".uploader").toast("show");

      if (imgType.indexOf(file.type) != -1) {
        const objectUrl = await uploadFileOnS3(file);
        $(".logo-box").html("Waiting...");
        await updateLogoUrl(objectUrl);

        // $(".logo-box").css({
        //   backgroundImage: `url(${response})`,
        //   backgroundSize: "cover",
        // });
      } else {
        Snowball("Only Image Accepted!", "Please Upload Image!", "warning");
      }
    };
  });
});

//UPDATE LOGO URL
const updateLogoUrl = async (url) => {
  const token = getToken("authToken");
  const company = decodeToken(token);
  const id = company.data.uid;

  let formData = new FormData();
  formData.append("isLogo", true);
  formData.append("logoUrl", url);
  formData.append("token", token);

  const request = {
    type: "PUT",
    url: "/api/private/company/" + id,
    data: formData,
  };
  try {
    const response = await ajax(request);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
