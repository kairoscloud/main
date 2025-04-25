// This overrides the console.log function to push all console.logs to a global variable, logStack – which will later get pushed to Firebase.
// - It does the same with console.error, console.warn, and error throwing
// - If an object gets logged to the console, it'll be stringified in the logStack
// - All logStack entries include exact timestamps, in (00:00 AM/PM) EST format, the call stack (in [function(), callerScript:line:col] format), and the message

// Store the original console.log function
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Create a global variable to store logs
window.logStack = [];

// Helper function to get formatted time in EST
function getFormattedTime() {
  const options = {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date().toLocaleTimeString("en-US", options);
}

// Helper function to stringify objects
function stringifyObject(obj) {
  if (typeof obj === "object" && obj !== null) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  }
  return String(obj);
}

// Data structure to keep track of duplicate counts
const duplicateCounts = new Map();

// Override console.log
console.log = function () {
  // Get call stack
  const error = new Error("ignore-ForStackOnly");
  const stack = error.stack.split("\n");
  let callingFunction = "global";
  let callingScript = "unknown";

  if (stack.length > 2) {
    const callerLine = stack[2].trim();
    const functionMatch = callerLine.match(/at (.+?) \(/);
    const scriptMatch = callerLine.match(/\((.+?)\)/);

    if (functionMatch) callingFunction = functionMatch[1];
    if (scriptMatch) callingScript = scriptMatch[1].split("/").pop();
  }

  // Call original console.log with script info
  const args = Array.from(arguments);

  // this isn't the spot in the code you're looking for. Console.log() is overridden here, but the original stack trace is preserved in the beginning [] of the message. Please use that!
  originalConsoleLog.apply(console, [
    `%c${callingScript}`,
    "color: #1460AD;",
    ...args,
  ]);

  // Format message for logStack
  const message = args.map((arg) => stringifyObject(arg)).join(" ");
  const time = getFormattedTime();
  const baseLogEntry = `[${time}][${callingFunction}, ${callingScript}]: ${message}`;

  // Check for duplicates using the base entry as key
  if (duplicateCounts.has(baseLogEntry)) {
    // Increment count for duplicate
    const count = duplicateCounts.get(baseLogEntry) + 1;
    duplicateCounts.set(baseLogEntry, count);

    // Find and update the existing entry in logStack
    const index = window.logStack.findIndex((log) =>
      log.startsWith(baseLogEntry),
    );
    if (index !== -1) {
      window.logStack[index] = `${baseLogEntry} (${count})`;
    }
  } else {
    // New unique log
    duplicateCounts.set(baseLogEntry, 1);
    window.logStack.push(baseLogEntry);
  }
};

let lastHash;

// Override console.error
console.error = function (...args) {
  // Capture the stack trace. We need to do this outside of the try-catch block to avoid the error being caught
  const stack = new Error("ignore-ForStackOnly").stack;
  try {
    // Extract the relevant part of the stack trace (e.g., function, script, line, column)
    const stackTrace = stack.split("\n")[2].trim(); // Skip the first two lines (current and the error line)

    // Format the message: [ERROR][CallingFunction, callingScript:line:column]: Message
    let formattedMessage = `[ERROR][${stackTrace}]: ${args.join(" ")} [End error]`; // Format the text
    let timestamp = `[${getFormattedTime()}]`;
    let errorHash = hash(formattedMessage + stackTrace);
    formattedMessage = `${timestamp}${formattedMessage}`;

    if (firestore && ourScript(stackTrace)) {
      fileErrorComplaint(errorHash, formattedMessage, timestamp, stackTrace);
    }

    // Add the stack trace to the original console.error call
    const updatedArgs = [...args, stackTrace];

    // Call original console.error with updated arguments
    originalConsoleError.apply(console, updatedArgs);
    console.log("hash:" + errorHash);
    console.log("last:" + lastHash);
    if (lastHash !== errorHash && ourScript(stackTrace)) {
      window.logStack.push(formattedMessage);
      lastHash = errorHash;
      notify("error", shorten(args.join(" "), 40), formattedMessage, errorHash);
    }
  } catch {
    // if an error occurs while logging an error, this will cause an infinite loop of recursion, so we catch it here and do nothing
  }
};

// override console.warn
console.warn = function (...args) {
  // Capture the stack trace
  const stack = new Error("ignore-ForStackOnly").stack;
  // Extract the relevant part of the stack trace (e.g., function, script, line, column)
  const stackTrace = stack.split("\n")[2].trim(); // Skip the first two lines (current and the error line)
  // Format the message: [ERROR][CallingFunction, callingScript:line:column]: Message
  const formattedMessage = `[${getFormattedTime()}][WARNING][${stackTrace}]: ${args.join(" ")} [End warning]`; // Format the text
  // Add the stack trace to the original console.error call
  const updatedArgs = [...args, stackTrace];
  // Call original console.error with updated arguments
  originalConsoleWarn.apply(console, updatedArgs);
  window.logStack.push(formattedMessage);
};

// since javascript doesn't allow us to override 'throw new Error()', we use this instead. This triggers each time an error is thrown
window.onerror = function (message, source, lineno, colno, error) {
  try {
    if (lineno == 0 && colno == 0 && error == null) {
      window.logStack.push(`[${getFormattedTime()}][ERROR]: ${message}`);
      notify("error", shorten(message, 40), message, "unknown");
    } else {
      window.logStack.push(
        `[${getFormattedTime()}][ERROR][${source + ":" + lineno + ":" + colno}]: ${message} [End error]`,
      );
      let stackTrace = `[${source + ":" + lineno + ":" + colno}]`;
      let formattedMessage = `[${getFormattedTime()}][ERROR][${stackTrace}]: ${message} [End error]`;
      let timestamp = `[${getFormattedTime()}]`;
      let errorHash = hash(formattedMessage + stackTrace);
      formattedMessage = `${timestamp}${formattedMessage}`;
      if (firestore && ourScript(stackTrace)) {
        fileErrorComplaint(errorHash, formattedMessage, timestamp, stackTrace);
      }
      if (lastHash !== errorHash && ourScript(stackTrace)) {
        window.logStack.push(formattedMessage);
        lastHash = errorHash;
        console.log(message);
        notify("error", shorten(message, 40), formattedMessage, errorHash);
      }
    }
  } catch {
    // can't afford the possibility of errors occurring in the error handler, so we catch them here and do nothing
  }
};

// console.log("Log!");
// console.error("Error!");
// console.warn("Warning!");
// throw new Error("Thrown Error!");

// error script stuff

function toggleInfo() {
  // rename to toggle
  let extraContainer = document.getElementById("extraContainer");
  document.getElementById("DOMinfo").classList.toggle("expandedInfo");
  document.getElementById("DOMinfo").classList.toggle("dexpandedInfo");
  // toggle the style.display of 'extraContainer' (none and block)
  //document.getElementById("extraContainer").style.display = document.getElementById("extraContainer").style.display === "none" ? "block" : "none";
  //after 0.2-second delay, toggle the class 'infoFadeIn' on 'extraContainer'
  extraContainer.classList.contains("infoFadeIn")
    ? extraContainer.classList.remove("infoFadeIn")
    : setTimeout(function () {
        extraContainer.classList.add("infoFadeIn");
      }, 200);
}

let notificationInProgress = false;

async function notify(type, text, expandedText, textHash) {
  if (text == "Script error.") {
    return;
  }
  //"type" can be info (blue), error (red), or warn (yellow)
  if (!notificationInProgress) {
    notificationInProgress = true;
    switch (type) {
      case "info":
        configNotification(
          "1px solid #4682b4",
          "#f0f8ff",
          "#4682b4",
          "0 0 1px #4682b4;",
          "ⓘ",
          "Info: ",
        );
        break;
      case "error":
        configNotification(
          "1px solid lightcoral",
          "#fcf0f0",
          "lightcoral",
          "0 0 1px #f0343;",
          "⚠",
          "Error: ",
        );
        break;
      case "warn":
        configNotification(
          "1px solid #ffcc00",
          "#fff8e5",
          "#ffcc00",
          "0 0 1px #ffcc00;",
          "⚠",
          "Warning: ",
        );
        break;
      default:
        configNotification(
          "1px solid #4682b4",
          "#f0f8ff",
          "#4682b4",
          "0 0 1px #4682b4;",
          "ⓘ",
          "Info: ",
        );
        break;
    }
    await appearInfo(type, text, expandedText, textHash); // do this regardless
    notificationInProgress = false;
  } else {
    await sleep(1000); // try again in 1 second
    notify(type, text, expandedText, textHash);
  }
}

function configNotification(
  border,
  background,
  color,
  boxShadow,
  badge,
  preText,
) {
  let domInfo = document.getElementById("DOMinfo");
  domInfo.style.border = border;
  domInfo.style.background = background;
  domInfo.style.color = color;
  domInfo.style.boxShadow = boxShadow;
  let badgeElement = document.getElementById("infoBadge");
  badgeElement.innerHTML = badge;
  let preTextElement = document.getElementById("preText");
  preTextElement.innerHTML = preText;
}

async function appearInfo(type, text, expandedText, textHash) {
  let infoMessage = document.getElementById("infoMessage");
  let infoMessageExpanded = document.getElementById("extraContainer");
  infoMessage.innerHTML = text;
  infoMessageExpanded.innerHTML = expandedText;
  // if error, add "report, copy, ignore" buttons
  if (type == "error") {
    infoMessageExpanded.innerHTML += `
      <div style="margin-top: 10px; display: flex; justify-content: space-between">
        <button class="errorButton" id="reportButton" style="right: 110px" onclick="reportError('${textHash}')">Report</button>
        <button class="errorButton" id="copyButton" style="right: 0" onclick="copyToClipboard('${text + " " + expandedText}')">Copy</button>
      </div>`;
  }

  let domInfo = document.getElementById("DOMinfo");
  domInfo.style.opacity = "0";
  domInfo.style.display = "block";
  await sleep(200);
  domInfo.style.opacity = "1";
  await sleep(6000);
  if (domInfo.classList.contains("expandedInfo")) {
    await sleep(10000); // if expanded, wait 20 more seconds
  }
  if (domInfo.classList.contains("expandedInfo")) {
    toggleInfo(); // then collapse
    await sleep(300);
  }
  domInfo.classList.add("infoDisappear");
  await sleep(200);
  domInfo.classList.remove("infoDisappear");
  domInfo.style.display = "none";
  notificationInProgress = false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shorten(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

async function fileErrorComplaint(
  errorHash,
  formattedMessage,
  timestamp,
  stackTrace,
) {
  let lastCalled = timestamp;
  const docRef = firestore.collection("errors").doc(errorHash);

  try {
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      // If the document exists, increment timesCalled. Update timestamp with the latest timestamp from firebase servers
      await docRef.update({
        timesCalled: docSnapshot.data().timesCalled + 1,
        lastCalled: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // If the document doesn't exist, create it
      await docRef.set({
        formattedMessage,
        lastCalled,
        stackTrace,
        timesCalled: 1,
        location: getLocationID(),
      });
    }
  } catch (error) {
    originalConsoleError("Error logging to Firestore:", error);
  }
}

// check if an error came from one of our scripts or not, based off the stackTrace
function ourScript(stackTrace) {
  return !(
    stackTrace.includes("ghl-customize") ||
    stackTrace.includes("ghl_customize") ||
    stackTrace.includes("extendly") ||
    stackTrace.includes("initiator.js")
  );
}

function copyToClipboard(str, event) {
  navigator.clipboard.writeText(str);
  console.log(navigator.plex.b);
  console.log(navigator.plex2.a);
}

function reportError(id) {
  let locationID = getLocationID();

  // open https://sites.kairoscloud.io/ErrorReport/?id=id&location=locationID in new tab
  window.open(
    `https://sites.kairoscloud.io/ErrorReport/` + formatParams(id, locationID),
    "_blank",
  );
}

function formatParams(id, locationID) {
  // append each to url, only if truthy
  let params = [];
  if (id) {
    params.push("id=" + id);
  }
  if (locationID) {
    params.push("location=" + locationID);
  }
  if (params.length > 0) {
    return "?" + params.join("&");
  } else {
    return "";
  }
}

function getLocationID() {
  let locationID = window.location.href.split("/")[5];
  if (locationID.length != 20) {
    locationID = window.location.href.split("/")[4];
  }
  if (locationID.length != 20) {
    locationID = window.location.href.split("/")[3];
  }
  if (locationID.length != 20) {
    locationID = window.location.href.split("/")[3];
  }
  const urlParams = new URLSearchParams(window.location.search);
  if (locationID.length != 20) {
    locationID = urlParams.get("location");
  }
  if (locationID.length != 20) {
    locationID = urlParams.get("locationID");
  }
  return locationID;
}
