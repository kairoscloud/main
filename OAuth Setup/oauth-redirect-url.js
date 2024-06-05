// Load Function
window.loadInt = setInterval(loadFunc, 100);

function loadFunc() {
  var x = document.getElementById("button-ydAztZSX3U_btn");
  if (x === undefined || x === null) {} else {
    document.getElementById("button-ydAztZSX3U_btn").addEventListener('click', copyCode);
    authcodeFunc();
    clearInterval(loadInt);
  }
}

// Get Authorization Code
function authcodeFunc() {
  window.url = window.location.href;
  window.code = url.split("code=")[1];
  if (code === undefined || code === null) {} else {
    document.getElementById("sub-heading-_9WWOhxpa1").children[0].children[0].children[0].innerText = code;
    document.getElementById("sub-heading-_9WWOhxpa1").children[0].classList.remove("hide");
  }
}

// Copy Code Function
function copyCode() {
  navigator.clipboard.writeText(code);
  document.getElementById("button-ydAztZSX3U_btn").style = "background-color: #4c4c4c";
}
