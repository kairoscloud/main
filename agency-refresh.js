// GHL Customizer Code
var customizer = document.createElement('script');
var src1 = "https://cdn.everypages.com/ghl-customizer/ghl_customizer.php?agency_id=1x762kiz4";
customizer.setAttribute("id", "ghl-customizer-script");
customizer.src= src1;
document.getElementsByTagName('head')[0].appendChild(customizer);

// ThemeBuilder Code
var themebuilder = document.createElement('script');
var src2 = "https://builder.themarketerstoolkit.com/hlembed.js";
themebuilder.setAttribute("id", "themebuilder-script");
themebuilder.setAttribute("data-agency-id", "1x762kiz4");
themebuilder.src= src2;
document.getElementsByTagName('head')[0].appendChild(themebuilder);

// Jostens Custom Code
window.addEventListener('load', function () {
  var group = document.body.classList;
  if (group.contains("jostens") === true) {
    var jostens = document.createElement('script');
    var src3 = "https://kairoscloud.github.io/jostens/directory.js?";
    jostens.setAttribute("id", "jostens-custom-js");
    jostens.src= src3;
    document.getElementsByTagName('head')[0].appendChild(jostens);
  }
})

// Testing Custom Code
var url = window.location.href.split("/")[3];
alert(url);
