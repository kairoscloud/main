let sScript_ver = 0;
// The Kairos Cloud settings script
// What does it do?
// - Removes some AI garbage features from the settings menu
// Runs on https://app.kairoscloud.io/v2/location/*/settings
// - Not Jostens specific, runs on all subaccounts
// Loads from https://kairoscloud.github.io/main/settingsScript.js
// Jacob Westra – jacob@thekairosmedia.com

let sScript_id = "contacts"; // autoload form id later
let sScript_hash = hash(document.currentScript.textContent).substring(4); // last 4 hex digits of hash
console.log(sScript_id + " v" + sScript_ver + "-" + sScript_hash); // format: id v00-ffff
active[sScript_id] = Date.now();

// declare global variables
// why put them in the global scope? It's useful to have them available in the console for debugging purposes
// all variables will be reset when main is called again

// called on initialization or restart
main_settings();
function main_settings() {
  // this is just protocol as defined by the script loader
  // it's not necessary for the functionality of the rest of the script
  // it's just a way to keep track of the script's status
  let activeUpdateIntv = setInterval(() => {
    active[sScript_id] = Date.now();
    if (stop[sScript_id]) {
      clearInterval(activeUpdateIntv);
      console.log(sScript_id + " stopped!");
    }
  }, 2000);

  console.log("sScript running!");
}

function waitForElement(query, continuous, callback) {
  console.log("Listening for element '" + query + "'...");
  const observer = new MutationObserver(() => {
    const element = document.querySelector(query);
    // if exists, and if not already modified
    if (element && !element.hasAttribute("sScriptModified")) {
      element.setAttribute("sScriptModified", true); // mark as modified
      if (!continuous) {
        observer.disconnect();
      }
      console.log("Found element '" + query + "'");
      callback(element); // call the callback function with found element as arg
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check in case the element is already present
  const element = document.querySelector(query);
  if (element && !element.hasAttribute("sScriptModified")) {
    element.setAttribute("sScriptModified", true);
    if (!continuous) {
      observer.disconnect();
    }
    console.log("Found element '" + query + "'");
    callback(element);
  }
}
