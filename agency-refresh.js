// Random Refresh ID
window.id = Math.random().toString(36).slice(2, 7);

// GHL Customizer Code
var customizer = document.createElement("script");
var src1 =
  "https://cdn.everypages.com/ghl-customizer/ghl_customizer.php?agency_id=1x762kiz4&id=" +
  id;
customizer.setAttribute("id", "ghl-customizer-script");
customizer.src = src1;
document.getElementsByTagName("head")[0].appendChild(customizer);
console.log("GHL Customizer Loaded!");

// ThemeBuilder Code
var themebuilder = document.createElement("script");
var src2 = "https://builder.themarketerstoolkit.com/hlembed.js?" + id;
themebuilder.setAttribute("id", "themebuilder-script");
themebuilder.setAttribute("data-agency-id", "1x762kiz4");
themebuilder.src = src2;
document.getElementsByTagName("head")[0].appendChild(themebuilder);
console.log("GHL ThemeBuilder Loaded!");

function onUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl.includes("contacts/smart_list")) {
    console.log("URL matches the target string:", currentUrl);
    loadBody();
  }
}

window.addEventListener("popstate", onUrlChange);

// Jostens Custom Code
// const loadInterval = setInterval(loadBody, 50);
function loadBody() {
  var body = document.body.classList;
  if (body.length === 0) {
  } else {
    var jostens = document.createElement("script");
    var src3 = "https://kairoscloud.github.io/jostens/directory.js?" + id;
    jostens.setAttribute("id", "jostens-custom-js");
    jostens.src = src3;
    document.getElementsByTagName("head")[0].appendChild(jostens);
  }
}

// this is the code to auto-click the email analytics tab in smtp_service.

// console.log("HREF: " + window.location.href);
// if((window.location.href).includes("smtp_service")){
//   let emailInterval = setInterval(() => {
//     let iframe = document.querySelector("#isvApp > iframe");
//     let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//     let emailButton = iframeDocument.querySelector("#app > div > div > div.n-tabs.n-tabs--line-type.n-tabs--medium-size.n-tabs--top > div.n-tabs-nav--line-type.n-tabs-nav--top.n-tabs-nav > div > div > div > div.n-tabs-wrapper > div:nth-child(4) > div.n-tabs-tab");
//     console.log("Checking for element");
//     if(emailButton){
//       emailButton.click();
//       clearInterval(EmailInterval);
//     }
//   }, 500);
// }

// Testing Custom Code
var url = window.location.href.split("/")[5];
if (url === "owNEzpbrfBjp4weSARXD") {
  var test = document.createElement("script");
  var src4 = "https://kairoscloud.github.io/main/test-code.js?" + id;
  test.setAttribute("id", "test-code");
  test.src = src4;
  document.getElementsByTagName("head")[0].appendChild(test);
}
