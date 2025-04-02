let dScript_ver = 13;
// The Kairos Cloud domain page script
// What does it do?
// - Listens for when users add a new domain, since the GHL API doesn't support this
// Runs on https://app.kairoscloud.io/v2/location/*/settings/domain
// - Not Jostens specific, runs on all subaccounts
// Loads from https://kairoscloud.github.io/main/domainScript.js
// Jacob Westra – jacob@thekairosmedia.com

let dScript_id = "domainScript"; // autoload form id later
let dScript_hash = hash(document.currentScript.textContent).substring(4); // last 4 hex digits of hash
console.log(dScript_id + " v" + dScript_ver + "-" + dScript_hash); // format: id v00-ffff
active[dScript_id] = Date.now();

// declare global variables
// why put them in the global scope? It's useful to have them available in the console for debugging purposes
// all variables will be reset when main is called again

let locationID = window.location.pathname.split("/")[3];

// called on initialization or restart
main_domains();
function main_domains() {
  // this is just protocol as defined by the script loader
  // it's not necessary for the functionality of the rest of the script
  // it's just a way to keep track of the script's status
  let activeUpdateIntv = setInterval(() => {
    active[dScript_id] = Date.now();
    if (stop[dScript_id]) {
      clearInterval(activeUpdateIntv);
      console.log(dScript_id + " stopped!");
    }
  }, 2000);

  waitForElement(
    '[data-testid="domain-list-content"]',
    false,
    function (element) {
      processDomains(element);
      addButton();
    },
  );

  console.log("dScript running!");
}

function waitForElement(query, continuous, callback) {
  console.log("Listening for element '" + query + "'...");
  const observer = new MutationObserver(() => {
    const element = document.querySelector(query);
    // if exists, and if not already modified
    if (element && !element.hasAttribute("dScriptModified")) {
      element.setAttribute("dScriptModified", true); // mark as modified
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
  if (element && !element.hasAttribute("dScriptModified")) {
    element.setAttribute("dScriptModified", true);
    if (!continuous) {
      observer.disconnect();
    }
    console.log("Found element '" + query + "'");
    callback(element);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processDomains(domainListContainer) {
  let domainsList = [];
  // domain elements look like this
  // for-loop for each of the element's children
  for (let domain of domainListContainer.children) {
    let elementText = domain.innerHTML;
    let domainName = elementText
      .split(`role="heading" aria-level="2">`)[1]
      .split("</div>")[0];
    domainsList.push(domainName);
  }

  //select all elements with .n-tag.n-tag--round.hl-default.inline-block
  await sleep(5000);
  console.log("Acquiring subdomains...");
  let subDomainHoverList = document.querySelectorAll(
    ".n-tag.n-tag--round.hl-default.inline-block",
  );

  if (!subDomainHoverList) {
    console.log("No subdomains found");
    return;
  }

  // loop through each element
  for (let i = 0; i < subDomainHoverList.length; i++) {
    // simulate hover for each
    subDomainHoverList[i].dispatchEvent(
      new Event("mouseenter", { bubbles: true }),
    );
    // wait 1s
    // await sleep(1000);
    // select all elements with .n-tag.n-tag--round.hl-default.inline-block
    let subDomainList = document.querySelectorAll(".hl-text-sm-normal");
    console.log(subDomainList);
    for (let i = 0; i < subDomainList.length; i++) {
      let subDomain = subDomainList[i];
      console.log(subDomain);
      let subDomainName = subDomain.innerText;
      domainsList.push(subDomainName);
    }
    subDomainHoverList[i].dispatchEvent(
      new Event("mouseleave", { bubbles: true }),
    );
  }

  // get the already-shown subdomains
  let asList = document.querySelectorAll(
    ".text-gray-700.truncate.hl-text-sm-medium",
  );

  for (let i = 0; i < asList.length; i++) {
    let asDomain = asList[i];
    let asDomainName = asDomain.innerText.replace(" \n+1", "");
    domainsList.push(asDomainName);
  }

  console.log(domainsList);
  addDomainToList(domainsList);
}

// Reference to the specific document
const docRef = firestore.collection("domains").doc(locationID);

// Function to add domain(s) to the list without duplicates
async function addDomainToList(newDomains) {
  // Ensure newDomains is always an array
  if (!Array.isArray(newDomains)) {
    newDomains = [newDomains];
  }

  // Use a transaction to ensure data consistency
  return firestore.runTransaction(async (transaction) => {
    // Get the current document
    const doc = await transaction.get(docRef);

    if (!doc.exists) {
      // Document doesn't exist, create it with the domains
      transaction.set(docRef, {
        domainList: newDomains,
      });
      console.log("Document created with initial domains");
    } else {
      // Document exists, update the array without adding duplicates
      const data = doc.data();
      const currentList = data.domainList || [];

      // Filter out domains that already exist in the list
      const domainsToAdd = newDomains.filter(
        (domain) => !currentList.includes(domain),
      );

      if (domainsToAdd.length > 0) {
        // Use arrayUnion to add the new domains
        transaction.update(docRef, {
          domainList: [...currentList, ...domainsToAdd],
        });
        console.log(`Added ${domainsToAdd.length} new domain(s)`);
      } else {
        console.log("No new domains to add");
      }
    }
  });
}

function addButton() {
  let toolBar = document.querySelectorAll(
    ".flex.items-center.justify-end.-mb-\\[68px\\]",
  )[0];
  // insert as first child
  let buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = `
    <button class="n-button n-button--default-type n-button--medium-type"
            style="border: 1px solid rgb(229, 231, 235); margin-right: 5px"
            onclick="refresh()"
            onmouseover="showTooltip(event)"
            onmousemove="positionTooltip(event)"
            onmouseout="hideTooltip()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="96" height="96" viewBox="0,0,256,256" style="width: 90%; height: 90%">
              <g fill="#2d2d2d" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M2,2l2.93945,2.93945c-1.81318,1.80876 -2.93945,4.30325 -2.93945,7.06055c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10v2c4.411,0 8,3.589 8,8c0,4.411 -3.589,8 -8,8c-4.411,0 -8,-3.589 -8,-8c0,-2.20599 0.90048,-4.20272 2.34961,-5.65039l2.65039,2.65039v-7z"></path></g></g>
              </svg>
            </button>
  `;

  toolBar.insertBefore(buttonContainer, toolBar.firstChild);
}

function refresh() {
  processDomains(document.querySelector('[data-testid="domain-list-content"]'));
}

let tooltip;

function createTooltip() {
  tooltip = document.createElement("div");
  tooltip.textContent =
    "Check for new domains that can be used in your campaigns";
  Object.assign(tooltip.style, {
    position: "fixed",
    background: "rgba(50, 50, 50, 0.9)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "14px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    transform: "translate(-50%, -120%)",
    transition: "opacity 0.15s ease",
    opacity: "0",
    zIndex: "999",
  });
  document.body.appendChild(tooltip);
}

function showTooltip(event) {
  if (!tooltip) createTooltip();
  tooltip.style.opacity = "1";
  positionTooltip(event);
}

function positionTooltip(event) {
  if (!tooltip) return;
  tooltip.style.left = event.clientX + "px";
  tooltip.style.top = event.clientY - 10 + "px";
}

function hideTooltip() {
  if (tooltip) tooltip.style.opacity = "0";
}

window.showTooltip = showTooltip;
window.positionTooltip = positionTooltip;
window.hideTooltip = hideTooltip;
