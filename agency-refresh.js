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

// Jostens Custom Code
let URLCheckInterval = setInterval(URLCheck, 2000); // check every 2 seconds

function URLCheck() {
  // console.log("Checking URL"); // uncomment when testing
  // if entering the contacts page, load script
  // the script will stop itself if not on contacts
  if (
    window.location.href.includes("contacts") &&
    !document.getElementById("jostens-custom-js") &&
    allowedLocation()
  ) {
    loadBody();
  }
}

function loadBody() {
  console.log("Loading Jostens Custom Code");
  var jostens = document.createElement("script");
  var src3 = "https://kairoscloud.github.io/jostens/directory.js?" + id;
  jostens.setAttribute("id", "jostens-custom-js");
  jostens.src = src3;
  document.getElementsByTagName("head")[0].appendChild(jostens);
}

// newLocation.js
var newLocScript = document.createElement("script");
var srcC = "https://kairoscloud.github.io/main/newLocation.js?" + id;
newLocScript.src = srcC;
document.getElementsByTagName("head")[0].appendChild(newLocScript);
console.log("newLoc script loaded");

// Firebase
var firebaseScript = document.createElement("script");
var srcA = "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js?" + id;
firebaseScript.src = srcA;
document.getElementsByTagName("head")[0].appendChild(firebaseScript);
console.log("Firebase script loaded");

// Cloud Firestore
var fireStoreScript = document.createElement("script");
var srcB =
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js?" + id;
fireStoreScript.src = srcB;
document.getElementsByTagName("head")[0].appendChild(fireStoreScript);
console.log("Firestore script loaded");

// Testing Custom Code
var url = window.location.href.split("/")[5];
if (url === "owNEzpbrfBjp4weSARXD") {
  var test = document.createElement("script");
  var src4 = "https://kairoscloud.github.io/main/test-code.js?" + id;
  test.setAttribute("id", "test-code");
  test.src = src4;
  document.getElementsByTagName("head")[0].appendChild(test);
}

function allowedLocation() {
  if (document.querySelector("body")) {
    return document.querySelector(".jostens");
  }
}
