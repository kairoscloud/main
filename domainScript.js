let dScript_ver = 8;
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
    true,
    function (element) {
      processDomains(element);
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
  }

  // get the already-shown subdomains
  let asList = document.querySelectorAll(
    ".text-gray-700.truncate.hl-text-sm-medium",
  );

  for (let i = 0; i < asList.length; i++) {
    let asDomain = asList[i];
    let asDomainName = asDomain.innerText;
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
