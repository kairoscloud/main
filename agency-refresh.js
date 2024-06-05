// GHL Customizer Code
var head2 = document.getElementsByTagName('head')[0];
var script2 = document.createElement('script');
var id2 = Math.random().toString(36).slice(2, 7);
var src2 = "https://cdn.everypages.com/ghl-customizer/ghl_customizer.php?agency_id=1x762kiz4&id=" + id2;
script2.setAttribute("id", "ghl-customizer-script");
script2.src= src2;
head2.appendChild(script2);

// ThemeBuilder Code
var head3 = document.getElementsByTagName('head')[0];
var script3 = document.createElement('script');
var id3 = Math.random().toString(36).slice(2, 7);
var src3 = "https://builder.themarketerstoolkit.com/hlembed.js?" + id3;
script3.setAttribute("id", "themebuilder-script");
script3.setAttribute("data-agency-id", "1x762kiz4");
script3.src= src3;
head3.appendChild(script3);

// Jostens Custom Code
window.addEventListener('load', function () {
  var group = document.body.classList;
  alert(group);
  if (group.contains("jostens") === true) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var id = Math.random().toString(36).slice(2, 7);
    var src = "https://kairoscloud.github.io/jostens/agency-content.js?" + id;
    script.setAttribute("id", "jostens-custom-js");
    script.src= src;
    head.appendChild(script);
  }
})
