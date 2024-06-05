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
var parts = (window.location.href).split('/');
var lastParts = parts[parts.length - 3] + "/" + parts[parts.length - 2] + "/" + parts[parts.length - 1];
if (lastParts === "contacts/smart_list/All") { // if last part of URL matches "contacts/smart_list/All"
  var head1 = document.getElementsByTagName('head')[0];
  var script1 = document.createElement('script');
  var id1 = Math.random().toString(36).slice(2, 7);
  var src1 = "https://drewderose.github.io/KairosMedia/Jostens/agency-content.js?" + id1;
  script1.setAttribute("id", "jostens-custom-code_agency-content");
  script1.src= src1;
  head1.appendChild(script1);
}

// Fiverr Custom Code (OFF)
var head4 = document.getElementsByTagName('head')[0];
var script4 = document.createElement('script');
var id4 = Math.random().toString(36).slice(2, 7);
var src4 = "https://fiverr.ghlbranding.com/drewderose/app.js?" + id4;
script4.setAttribute("id", "fiverr-custom-code");
script4.src= src4;
// head4.appendChild(script4);
