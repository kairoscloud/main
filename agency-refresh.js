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
    allowedLocation(window.location.href)
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

// Testing Custom Code
var url = window.location.href.split("/")[5];
if (url === "owNEzpbrfBjp4weSARXD") {
  var test = document.createElement("script");
  var src4 = "https://kairoscloud.github.io/main/test-code.js?" + id;
  test.setAttribute("id", "test-code");
  test.src = src4;
  document.getElementsByTagName("head")[0].appendChild(test);
}

function allowedLocation(pageURL) {
  let pagelocation = pageURL.split("/")[5];
  return (
    pagelocation == "owNEzpbrfBjp4weSARXD" || // jostens demo
    pagelocation == "Psie74UmJnCQR7xxTRXa" || // jostens of Newhall, CA
    pagelocation == "jvJWOe4Ds0CGBV6p2cl9" || // jostens of Pittsburg, KS
    pagelocation == "SUIEeAqgsArrIiPCkEna" || // jostens of Kalamazoo, MI
    pagelocation == "piRoFhArDXY4EYyWbmex" || // jostens of Lisle, IL
    pagelocation == "PqeI2v9lcicAtJBI7mzs" || // jostens of NE Kansas
    pagelocation == "20wqXn14oRdWJ2IN02G3"    // your local jostens (Clackmas, OR)
  );
}
