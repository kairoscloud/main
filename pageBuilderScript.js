let pbScript_ver = 25;
// The Kairos Cloud Page Builder script
// What does it do?
// - Adds a copy/paste menu for custom fields in the page/form builder
// Loads in from:
// - https://kairoscloud.github.io/main/settingsScript.js
// Runs on pages:
// - https://app.kairoscloud.io/location/*/page-builder/*
// - https://app.kairoscloud.io/v2/location/*/form-builder-v2/*
// - (Jostens + Kairos Cloud only)

let pbScript_id = "pageBuilderScript"; // autoload form id later
let pbScript_hash = hash(document.currentScript.textContent).substring(4); // last 4 hex digits of hash
console.log(pbScript_id + " v" + pbScript_ver + "-" + pbScript_hash); // format: id v00-ffff
active[pbScript_id] = Date.now();

// declare global variables
// why put them in the global scope? It's useful to have them available in the console for debugging purposes
// all variables will be reset when main is called again

// called on initialization or restart
let otherOptions = "";
let locationAccessKey = "";
let thisLocation = window.location.href.split("/")[4];
if (thisLocation == "location") {
  thisLocation = window.location.href.split("/")[5];
}
main_pageBuilderScript();
function main_pageBuilderScript() {
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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  console.log("Page builder script running!");

  let isForm = false;
  appElement = "#funnelBuilderApp";
  if (window.location.href.includes("form-builder-v2")) {
    isForm = true;
    appElement = "#formBuilderApp";
  }

  waitForElement(appElement, false, async function (element) {
    await sleep(5100); // wait for the page to load
    await getLocationAccessKey(thisLocation);
    // we call injectCFDropdown() in getLocationAccessKey()
  });
}

async function injectCFDropdown() {
  console.log("Injecting dropdown...");
  let element = document.querySelector(appElement);
  const newDiv = document.createElement("div");
  newDiv.id = "cfDropdown";
  newDiv.style.position = "absolute";
  newDiv.style.top = "43.8pt";
  newDiv.style.right = "160pt";
  newDiv.innerHTML = `
    <head>
      <style>
        .dropdown {
          position: relative;
          width: 160pt;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 15px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          margin-top: 4px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .dropdown.active .dropdown-content {
          display: block;
        }

        .option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 15px;
          cursor: default;
        }

        .option:hover {
          background: #f5f5f5;
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          opacity: 0.6;
        }

        .copy-btn:hover {
          opacity: 1;
        }

        .chevron {
          border: solid #666;
          border-width: 0 2px 2px 0;
          display: inline-block;
          padding: 3px;
          transform: rotate(45deg);
          transition: transform 0.2s;
        }

        .dropdown.active .chevron {
          transform: rotate(-135deg);
        }
      </style>

    <body>
      <div class="dropdown" id="mainCFDropdown">
        <div class="dropdown-header">
          <span>Custom Fields</span>
          <span class="chevron"></span>
        </div>
        <div class="dropdown-content">

          ${option("School Name", "[[school_name]]")}
          ${option("School Location", "[[school_location]]")}
          ${option("School Mascot", "[[school_mascot]]")}
          ${option("School Logo Link", "[[school_logo_link]]")}
          ${option("Jostens Website Link", "[[jostens_website_link]]")}
          ${option("Landing Page 1", "[[landing_page_1]]")}
          ${option("Landing Page 2", "[[landing_page_2]]")}
          ${option("Order Due Date", "[[order_due_date]]")}


            <div class="divider">
                <span style="font-size: 9pt; color: #b4b4b4">My Custom Fields</span>
            </div>

            <style>
            .divider {
                display: flex;
                align-items: center;
                margin: 10px 10px;
            }

            .divider::before {
                content: "";
                flex: 1;
                border-bottom: 1px solid #b4b4b4;
                margin-right: 10px;
            }

            .divider::after {
                content: "";
                flex: 1;
                border-bottom: 1px solid #b4b4b4;
                margin-left: 10px;
            }
            </style>

            ${otherOptions}


        </div>
      </div>

  `;

  element.insertBefore(newDiv, element.firstChild);

  // Toggle dropdown
  document
    .querySelector(".dropdown-header")
    .addEventListener("click", function () {
      document.querySelector(".dropdown").classList.toggle("active");
    });

  // Copy functionality
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const value = this.dataset.value;
      navigator.clipboard.writeText(value).then(() => {
        // Optional: Add some visual feedback
        const originalColor = this.style.color;
        this.style.color = "#4CAF50";
        setTimeout(() => {
          this.style.color = originalColor;
        }, 500);
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    const dropdown = document.querySelector("#mainCFDropdown");
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
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

async function assembleCFHTML() {
  console.log("Assembling custom fields...");
  const url =
    "https://services.leadconnectorhq.com/locations/" +
    thisLocation +
    "/customFields";
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + locationAccessKey,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    otherOptions = ""; // reset the otherOptions, because sometimes customFields get added twice because of page changes, yet script stays loaded
    for (let i = 0; i < data.customFields.length; i++) {
      if (data.customFields[i].placeholder.includes("  ")) {
        addOption(
          data.customFields[i].name,
          data.customFields[i].placeholder.replace("  ", ""),
        );
      }
    }
    console.log("injecting...");
    injectCFDropdown();
  } catch (error) {
    console.error(error);
  }
}

async function getLocationAccessKey(loc) {
  if (loc == "yfyIrXrm61r57rx3ex4N") {
    injectCFDropdown();
    return;
  }
  console.log("Getting location access key: " + loc);
  firestore // grab the location access key from Firebase
    .collection("tokens")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id == loc) {
          locationAccessKey = doc.data().locationAccessToken;
          console.log("Found!");
          assembleCFHTML();
          return;
        }
      });
    });
}

function addOption(name, placeholder) {
  otherOptions += option(name, placeholder);
}

function option(name, data) {
  return `
    <div class="option">
      <span>${name}</span>
      <button class="copy-btn" data-value="${data}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  `;
}
