//** GET COUNTRY CODE *****/
$(document).ready(() => {
  $(".country").on("input", async function () {
    let keyword = $(this).val().trim().toLowerCase();
    const loclaData = checkInLocalStorage("countryCode");
    if (loclaData.isExists) {
      console.log(loclaData);
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
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};
