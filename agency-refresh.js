window.head = document.getElementsByTagName('head')[0];
window.id = Math.random().toString(36).slice(2, 7);

// GHL Customizer Code
var customizer = document.createElement('script');
var src1 = "https://cdn.everypages.com/ghl-customizer/ghl_customizer.php?agency_id=1x762kiz4&id=" + id;
customizer.setAttribute("id", "ghl-customizer-script");
customizer.src= src1;
head.appendChild(customizer);

// ThemeBuilder Code
var themebuilder = document.createElement('script');
var src2 = "https://builder.themarketerstoolkit.com/hlembed.js?" + id;
themebuilder.setAttribute("id", "themebuilder-script");
themebuilder.setAttribute("data-agency-id", "1x762kiz4");
themebuilder.src= src2;
head.appendChild(themebuilder);

// Jostens Custom Code
window.addEventListener('load', function () {
  var group = document.body.classList;
  if (group.contains("jostens") === true) {
    var jostens = document.createElement('script');
    var src3 = "https://kairoscloud.github.io/jostens/agency-content.js?" + id;
    jostens.setAttribute("id", "jostens-custom-js");
    jostens.src= src3;
    head.appendChild(jostens);
  }
})
