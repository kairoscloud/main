// Random Refresh ID
window.id = Math.random().toString(36).slice(2, 7);

// GHL Customizer Code
var customizer = document.createElement('script');
var src1 = "https://cdn.everypages.com/ghl-customizer/ghl_customizer.php?agency_id=1x762kiz4&id=" + id;
customizer.setAttribute("id", "ghl-customizer-script");
customizer.src= src1;
document.getElementsByTagName('head')[0].appendChild(customizer);
console.log("GHL Customizer Loaded!");

// ThemeBuilder Code
var themebuilder = document.createElement('script');
var src2 = "https://builder.themarketerstoolkit.com/hlembed.js?" + id;
themebuilder.setAttribute("id", "themebuilder-script");
themebuilder.setAttribute("data-agency-id", "1x762kiz4");
themebuilder.src= src2;
document.getElementsByTagName('head')[0].appendChild(themebuilder);
console.log("GHL ThemeBuilder Loaded!");

// Jostens Custom Code
const loadInterval = setInterval(loadBody, 50);
function loadBody() {
  var body = document.body.attr("class").split(/\s+/);
  alert(body);
  if (body === undefined) {} else {
    if (body.contains("jostens") === true) {
      var jostens = document.createElement('script');
      var src3 = "https://kairoscloud.github.io/jostens/directory.js?" + id;
      jostens.setAttribute("id", "jostens-custom-js");
      jostens.src= src3;
      document.getElementsByTagName('head')[0].appendChild(jostens);
    }
    clearInterval(loadInterval);
  }
}

// Testing Custom Code
var url = window.location.href.split("/")[5];
if (url === "owNEzpbrfBjp4weSARXD") {
  var test = document.createElement('script');
  var src4 = "https://kairoscloud.github.io/main/test-code.js?" + id;
  test.setAttribute("id", "test-code");
  test.src= src4;
  document.getElementsByTagName('head')[0].appendChild(test);
}
