let pbScript_ver = 0;
// The Kairos Cloud Page Builder script
// What does it do?
// - Adds a copy/paste menu for custom fields in the page builder
// Loads in from:
// - https://kairoscloud.github.io/main/settingsScript.js
// Runs on page:
// - https://app.kairoscloud.io/location/*/page-builder/*

let pbScript_id = "pageBuilderScript"; // autoload form id later
let pbScript_hash = hash(document.currentScript.textContent).substring(4); // last 4 hex digits of hash
console.log(pbScript_id + " v" + pbScript_ver + "-" + pbScript_hash); // format: id v00-ffff
active[pbScript_id] = Date.now();

// declare global variables
// why put them in the global scope? It's useful to have them available in the console for debugging purposes
// all variables will be reset when main is called again

// called on initialization or restart
main_pageBuilder();
function main_pageBuilder() {
  // this is just protocol as defined by the script loader
  // it's not necessary for the functionality of the rest of the script
  // it's just a way to keep track of the script's status
  let activeUpdateIntv = setInterval(() => {
    active[pbScript_id] = Date.now();
    if (stop[pbScript_id]) {
      clearInterval(activeUpdateIntv);
      console.log(pbScript_id + " stopped!");
    }
  }, 2000);

  console.log("Page builder script running!");
}

function waitForElement(query, continuous, callback) {
  console.log("Listening for element '" + query + "'...");
  const observer = new MutationObserver(() => {
    const element = document.querySelector(query);
    // if exists, and if not already modified
    if (element && !element.hasAttribute("pbScriptModified")) {
      element.setAttribute("pbScriptModified", true); // mark as modified
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
  if (element && !element.hasAttribute("pbScriptModified")) {
    element.setAttribute("pbScriptModified", true);
    if (!continuous) {
      observer.disconnect();
    }
    console.log("Found element '" + query + "'");
    callback(element);
  }
}
