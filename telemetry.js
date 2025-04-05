// Telemetry.js
// What does it do?
//  Upon initialization:
//   - It creates an entry in firebase (if not already exists), with a unique telemetry ID
//   - It populates the entry with every single piece of data it can get from the browser
//  Every 2 minutes:
//    - Pushes the logStack to Firebase, after turning it into a string and separating it by newlines

console.log("Telemetry loaded!");

const browserInfo = getBrowserInfo();

// create a unique telemetryID
let userAgent = navigator.userAgent;
let platform = navigator.platform;
let browserName = browserInfo.name;
let browserVersion = browserInfo.version;
let screenResolution = `${window.screen.width}x${window.screen.height}`;
let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let colorDepth = window.screen.colorDepth;
let currentDay = telemetryGetCurrentDay();
// get parameter "ref" from <script> embedded in HTML
const currentScript = document.currentScript;
let ref = currentScript.dataset.ref;

window.telemetryID =
  ref +
  "-" +
  browserName +
  browserVersion +
  "-" +
  platform +
  "-" +
  hash(
    userAgent +
      platform +
      browserName +
      browserVersion +
      currentDay +
      screenResolution +
      timeZone +
      colorDepth +
      currentDay,
  );

// format: browser-platform-123456
console.log("Telemetry ID: " + telemetryID);

const userTelemetryData = {
  telemetryStarted: Date.now(),
  userAgent: navigator.userAgent,
  lastUpdated: Date.now(),
  platform: navigator.platform,
  cookiesEnabled: navigator.cookieEnabled,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  windowSize: `${window.innerWidth}x${window.innerHeight}`,
  referrer: ref || "No referrer",
  startingURL: window.location.href,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  colorDepth: window.screen.colorDepth,
  deviceMemory: navigator.deviceMemory || "Not available",
  hardwareConcurrency: navigator.hardwareConcurrency || "Not available",
  browserName: browserInfo.name,
  browserVersion: browserInfo.version,
};

// create a telemetry entry in firestore, if not already there. In either case, store the doc ref as telemetryRef.

let telemetryDocRef = firestore.collection("telemetry").doc(window.telemetryID);

// check if fields are already present
telemetryDocRef.get().then((doc) => {
  if (doc.exists) {
    console.log("Updating existing telemetry instance");
  } else {
    telemetryDocRef.set(userTelemetryData);
    console.log("New telemetry instance created");
  }
});

function getBrowserInfo() {
  const ua = navigator.userAgent;
  let temp;
  let match =
    ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?:\/| )?rv:?)\/?\s*(\d+)/i,
    ) || [];
  if (/trident/i.test(match[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: "IE", version: temp[1] || "" };
  }
  if (match[1] === "Chrome") {
    temp = ua.match(/\b(OPR|Edg)\/(\d+)/);
    if (temp !== null) {
      return {
        name: temp[1].replace("OPR", "Opera").replace("Edg", "Edge"),
        version: temp[2],
      };
    }
  }
  match = match[2]
    ? [match[1], match[2]]
    : [navigator.appName, navigator.appVersion, "-?"];
  if ((temp = ua.match(/version\/(\d+)/i)) !== null) {
    match.splice(1, 1, temp[1]);
  }
  return {
    name: match[0],
    version: match[1],
  };
}

// function that get the current day, in the format of MM-DD-YYYY
function telemetryGetCurrentDay() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

let telemetryInterval = setInterval(() => {
  // we need to wrap this in a try-catch: it runs every 2 minutes, and we can't afford for it to break the entire app
  try {
    telemetryDocRef.update({
      lastUpdated: Date.now(),
      consoleLog: formatLogStack(),
      locationID:
        window.location.href.split("/")[5] ||
        new URLsearchParams(window.location.href).get("locationID") ||
        "locationID not specified",
    });
  } catch (error) {
    console.log(
      "Could not sync telemetry: " + error + ". Please tell Drew & Jake!",
    );
  }
}, 120000); // 60s * 2 * 1000ms

function formatLogStack() {
  window.logStack.push(
    "Pushing telemetry data to Firebase. Timestamp: " +
      new Date().toLocaleString("en-US", { hour12: true }) +
      " (Epoch Time " +
      Date.now() +
      ")",
  );
  // window.logStack.push("Current URL: " + window.location.href);
  // window.logStack.push("Active scripts:");
  // let scriptsList = "";
  // for (let script of document.scripts) {
  //   let scriptSrc = script.src.split("/")[script.src.split("/").length - 1];
  //   if (scriptSrc.includes("?")) {
  //     scriptSrc = scriptSrc.split("?")[0]; // remove the randomly generated ID for cache-busting
  //   }
  //   scriptsList += scriptSrc + ", ";
  // }
  // window.logStack.push(scriptsList);
  // instead of all global variables, just log the ones that are relevant / we've made
  // window.logStack.push("Global variables:");
  // for (let variable in window) {
  //   if (!initialGlobals.includes(variable)) {
  //     window.logStack.push(variable + ": " + valueOf(variable)); // Logs only variables you've added
  //   }
  // }
  return window.logStack.join(" ##NL## "); // our specialized newline enumerator, since \n doesn't work in Firestore
}
