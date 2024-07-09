// this anonymizes the script. Makes it so that, if ran twice, it won't conflict with itself.

console.log("Jostens Directory Loaded!");
let timesLoaded = 0;
listenInterval = "";
URLInterval = "";

// Listen for Page Change
window.addEventListener("routeChangeEvent", pageFunc);
pageFunc();

function pageFunc() {
  timesLoaded++;
  console.log("Route Change Detected!");
  var url = window.location.href.split("/");
  if (url.includes("contacts") === true) {
    console.log("restarting script");
    restartScript();
  }
}

let prevCFInner = "";

function restartScript() {
  let checkInterval = setInterval(testIfLoaded, 100);

  function testIfLoaded() {
    console.log("Checking if loaded");

    var lastElement = document.querySelector(
      "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(14)",
    );
    // if the last element in the toolbar is loaded
    if (lastElement) {
      // if not Jostens subaccount...
      if (
        !document
          .querySelector(".filter-option .filter-option-inner")
          .innerHTML.includes("Jostens")
      ) {
        throw new Error(
          "Not a Jostens subaccount. Stopping script. Ignore me!",
        );
        clearInterval(checkInterval);
      }
      console.log("Loaded");
      clearInterval(checkInterval); // stop checking
      listenInterval = setInterval(activeListen, 50); // repeat every 50ms, indefinitely
      URLInterval = setInterval(checkIfPageChange, 2000); // repeat every 2 seconds, indefinitely
    }
  }

  function checkIfPageChange() {
    if (!window.location.href.includes("contacts")) {
      // if not in "contacts" anymore
      clearInterval(listenInterval);
      clearInterval(URLInterval);
      throw new Error("Page change detected. Stopping script. Ignore me!"); // this stops all execution of directory.js once the user is no longer on contacts page
    }
  }
}

function activeListen() {
  console.log("Listening"); // uncomment when testing

  if (!allowedLocation()) {
    throw new Error("Not allowed location. Stopping script. Ignore me!");
  }

  // listen for and click the "ok, proceed" button
  let buttonElement = document.querySelector(
    "button.hl-btn.inline-flex.items-center.px-4.py-2.border-2.border-curious-blue-400.text-sm.font-medium.rounded.text-curious-blue-500.hover\\:bg-curious-blue-100.focus\\:outline-none.focus\\:ring-2.focus\\:ring-offset-2.focus\\:ring-curious-blue-500",
  );
  if (buttonElement) {
    if (buttonElement.innerHTML.includes("proceed")) {
      buttonElement.click();
    }
  }

  // listen for and hide the "action" label and field
  let action = document.querySelector(
    "span[data-v-56639245][data-v-4a572634].text-sm.font-medium.text-gray-700",
  );

  if (action) {
    let actionForm = document.querySelector(
      '.form-row .form-group input[name="description"]',
    );
    actionForm.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );
    actionForm.value = "auto";
    action.style.display = "none";
    actionForm.style.display = "none";
  }

  let actionOther = document.querySelector(".mt-2 .mt-1 input#action");

  if (actionOther) {
    let tagField = document.querySelector(
      "input.py-1.outline-none.border-0.focus\\:border-0.focus\\:ring-0.focus\\:outline-none.sm\\:text-sm",
    );

    tagField.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    actionOther.value = "auto";

    actionOther.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    //actionOther.focus();
    // actionOther.style.display = "none";
    Array.from(document.querySelectorAll("*")).find(
      (el) => el.textContent.trim() === "Action*",
    ).style.display = "none"; // hide the "action*" text above as well
  }

  // check for the last element in the toolbar (this happens when "all" is clicked, and the toolbar refreshes)
  let lastElement = document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(14)",
  );
  if (lastElement) {
    DeleteElems();
    if (!document.getElementById("schoolContactButton")) {
      addSchoolContactButton();
    }
  }

  // if in "detail" window of contact...
  // remove the unwanted fields for school contacts (contact, general info, additional info)
  if (
    document.querySelector(
      "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.absolute.top-0.left-0.w-full.bg-white.z-\\[999\\] > div:nth-child(2)",
    )
  ) {
    modifyDetail();
  }

  if (!document.getElementById("customFormWrapper")) {
    let body = document.querySelector("body");

    let formHTML =
      `<customform id="uploadIframeWindow" style="display: none"><div data-v-4a7d910a="" hide-title="" id="__BVID__310___BV_modal_outer_" style="position: absolute; z-index: 1040;"><div id="__BVID__310" role="dialog" aria-labelledby="__BVID__310___BV_modal_title_" aria-describedby="__BVID__310___BV_modal_body_" class="modal fade show" aria-modal="true" style="display: block; padding-left: 0px;"><div class="modal-dialog modal-sm"><span tabindex="0"></span><div id="__BVID__310___BV_modal_content_" tabindex="-1" class="modal-content"><header id="__BVID__310___BV_modal_header_" class="modal-header"><h5 id="__BVID__310___BV_modal_title_" class="modal-title"></h5><h5 data-v-4a7d910a="" class="modal-title">Select file</h5><p>Once you're done, copy the link.</p><button type="button" aria-label="Close" onclick="closeUpload()" class="close">↩</button></header><div id="__BVID__310___BV_modal_body_" class="modal-body" style="position: relative; width: 100%; height: 75vh; overflow: hidden;"><div style="position: absolute; left: 0; top: 0; height: 50px; width: 150px; z-index: 10; background-color: #0D2D3F; display: block"></div><iframe src="https://app.kairoscloud.io/location/` +
      window.location.href.split("/")[5] +
      `/medias" style="position: absolute; top: 0px; left: 0; width: 100%; height: 75vh; border: none;"></iframe></div><!----></div><span tabindex="0"></span></div></div><div id="__BVID__310___BV_modal_backdrop_" class="modal-backdrop"></div></div></customform>`;

    formHTML += `<customform id="addFormHTML"><div data-v-4a7d910a="" hide-title="" id="__BVID__310___BV_modal_outer_" style="position: absolute; z-index: 1040;"><div id="__BVID__310" role="dialog" aria-labelledby="__BVID__310___BV_modal_title_" aria-describedby="__BVID__310___BV_modal_body_" class="modal fade show" aria-modal="true" style="display: block; padding-left: 0px;"><div class="modal-dialog modal-sm"><span tabindex="0"></span><div id="__BVID__310___BV_modal_content_" tabindex="-1" class="modal-content"><header id="__BVID__310___BV_modal_header_" class="modal-header"><h5 id="__BVID__310___BV_modal_title_" class="modal-title"></h5><h5 data-v-4a7d910a="" class="modal-title">Add School Contact</h5><button type="button" aria-label="Close" onclick="closeForm()" class="close">×</button></header><div id="__BVID__310___BV_modal_body_" class="modal-body"><div data-v-4a7d910a="" class="modal-body"><div data-v-4a7d910a="" class="modal-body--inner"><form data-v-4a7d910a=""><div data-v-4a7d910a="" class="row"><div data-v-4a7d910a="" class="col-sm-6"><div data-v-4a7d910a="" class="form-group"><div data-v-7d86ee8a="" data-v-4a7d910a="" class="hl-text-input-container msgsndr5" data-lpignore="true" data-vv-as="First name"><div data-v-7d86ee8a="" class="flex space-x-3"><span data-v-7d86ee8a="" for="msgsndr5" class="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">School Name</span><!----></div><div data-v-7d86ee8a="" class="relative rounded-md shadow-sm"><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><!----></div><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 mx-2 flex items-center pointer-events-none hl-text-input-addon"><!----></div><input data-v-7d86ee8a="" type="text" data-lpignore="true" autocomplete="msgsndr5" placeholder="e.g. Central High School" class="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr5" maxlength="" id="ASCname"><!----><div data-v-7d86ee8a="" class="absolute inset-y-0 right-0 flex items-center pointer-events-none hl-text-input-addon pr-3"><!----></div></div><!----><!----></div></div></div><div data-v-4a7d910a="" class="col-sm-6"><div data-v-4a7d910a="" class="form-group"><div data-v-7d86ee8a="" data-v-4a7d910a="" class="hl-text-input-container msgsndr6" data-lpignore="true" data-vv-as="Last name"><div data-v-7d86ee8a="" class="flex space-x-3"><span data-v-7d86ee8a="" for="msgsndr6" class="hl-text-input-label block text-sm font-medium text-gray-700 mb-1">Mascot</span><!----></div><div data-v-7d86ee8a="" class="relative rounded-md shadow-sm"><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><!----></div><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 mx-2 flex items-center pointer-events-none hl-text-input-addon"><!----></div><input data-v-7d86ee8a="" type="text" data-lpignore="true" autocomplete="msgsndr5" placeholder="e.g. Lions, Tigers, Bears" class="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr6" maxlength="" id="ASCmascot"><!----><div data-v-7d86ee8a="" class="absolute inset-y-0 right-0 flex items-center pointer-events-none hl-text-input-addon pr-3"><!----></div></div><!----><!----></div></div></div></div><div data-v-4a7d910a="" class="form-group"><span data-v-56639245="" data-v-4a7d910a="" class="text-sm font-medium text-gray-700">School Location</span><div data-v-4a7d910a=""><div data-v-4a7d910a="" class="primary-phone mb-3"><div data-v-4a7d910a="" class="flex mt-2"><div data-v-7d86ee8a="" data-v-4a7d910a="" class="hl-text-input-container msgsndr1 disabled:opacity-50 w-2/3" data-lpignore="true" autocomplete="msgsndr1"><div data-v-7d86ee8a="" class="flex space-x-3"><!----><!----></div><div data-v-7d86ee8a="" class="relative rounded-md shadow-sm"><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><!----></div><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 mx-2 flex items-center pointer-events-none hl-text-input-addon"><!----></div><input data-v-7d86ee8a="" type="text" data-lpignore="true" autocomplete="msgsndr1" placeholder="City, State Abbreviation" class="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr1" maxlength="" id="ASClocation"><!----><div data-v-7d86ee8a="" class="absolute inset-y-0 right-0 flex items-center pointer-events-none hl-text-input-addon pr-3"><!----></div></div><!----><!----></div><!----></div><div data-v-4a7d910a="" class="mt-3"><span data-v-4a7d910a="" class="error phone-error-message" style="display: none;"></span></div><div data-v-4a7d910a="" class="mt-3"><span data-v-4a7d910a="" class="error phone-error-message" style="display: none;"> Duplicate Phone Number. You can't enter the Phone Number twice </span></div></div></div><div data-v-4a7d910a="" class="form-group"><span data-v-56639245="" data-v-4a7d910a="" class="text-sm font-medium text-gray-700"><div data-v-4a7d910a="" style="margin-top: 25px; margin-bottom: 10px"><button data-v-4397f5e0="" data-v-4a7d910a="" type="upload" class="hl-btn  inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-apple-500 hover:bg-apple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-500 " onclick="addUploadWindow(event)"><!---->Upload school logo</button></div></span>
                <div style="margin-top:5px; margin-bottom: 3px;">Once you're done, paste the link here:</div><div data-v-4a7d910a=""><div data-v-4a7d910a="" class="primary-phone mb-3" onclick="pasteLink()" style="cursor: pointer"><div data-v-4a7d910a="" class="flex mt-2"><div data-v-7d86ee8a="" data-v-4a7d910a="" class="hl-text-input-container msgsndr1 disabled:opacity-50 w-2/3" data-lpignore="true" autocomplete="msgsndr1"><div data-v-7d86ee8a="" class="flex space-x-3"><!----><!----></div><div data-v-7d86ee8a="" class="relative rounded-md shadow-sm" style="margin-left: 40px">

        <div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><!----></div><div data-v-7d86ee8a="" class="absolute inset-y-0 left-0 mx-2 flex items-center pointer-events-none hl-text-input-addon"><i data-v-5e9b50c1="" id="copy-clipboard" class="far fa-copy ml-2 --dark copier self-center" style="border-radius: 4px; padding: 7px; font-size: 13pt; background-color: #E5E5E5; position: absolute; left: -55px; height: 30px !important; width: 30px !important; justify-content: center; text-align: center" onclick="pasteLink()"></i></div><input data-v-7d86ee8a="" type="text" data-lpignore="true" autocomplete="msgsndr1" placeholder="e.g. https://example.com/logo.png" class="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 block w-full sm:text-sm border-gray-300 rounded disabled:opacity-50 text-gray-800" name="msgsndr1" maxlength="" id="ASClogo"><!----><div data-v-7d86ee8a="" class="absolute inset-y-0 right-0 flex items-center pointer-events-none hl-text-input-addon pr-3"><!----></div></div><!----><!----></div><!----></div></div></div></div></div><div data-v-4a7d910a="" class="modal-buttons d-flex align-items-center justify-content-between"><button data-v-4397f5e0="" data-v-4a7d910a="" type="button" class="hl-btn inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-curious-blue-500" data-dismiss="modal" onclick="closeForm()"><!----> Close </button><div data-v-4a7d910a=""><button data-v-4397f5e0="" data-v-4a7d910a="" type="submit" class="hl-btn  inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-apple-500 hover:bg-apple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-500 " onclick="submitForm(event)"><!---->Submit</button></div></div></form></div></div></div><!----></div><span tabindex="0"></span></div></div><div id="__BVID__310___BV_modal_backdrop_" class="modal-backdrop"></div></div></customform>`;
    // create a new HTML element with the innerHTMl above:
    var formElement = document.createElement("customForm");
    formElement.id = "customFormWrapper";
    formElement.style.display = "none";
    formElement.innerHTML = formHTML;

    body.appendChild(formElement);
  }
} // end activeListen

function modifyDetail() {
  let docContactName = document.querySelector(
    "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.absolute.top-0.left-0.w-full.bg-white.z-\\[999\\] > div.w-full.contact-detail-nav.items-center.px-2.py-2\\.5.border-b.border-gray-200 > div:nth-child(1) > span",
  ).innerText;

  if (docContactName == "School Contact" || docContactName == null) {
    // the "tab" section (contact & company)
    document.querySelector(
      "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.absolute.top-0.left-0.w-full.bg-white.z-\\[999\\] > div:nth-child(2)",
    ).style.display = "none";
    let nodeList = document.querySelector(
      "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.h-full.overflow-y-auto.search-container",
    ).childNodes; // the element ids are randomized across the subaccounts, so we have to select them as child nodes
    nodeList[9].style.display = "none"; // contact
    nodeList[10].style.display = "none"; // general info
    nodeList[11].style.display = "none"; // additional info
  } else {
    document.querySelector(
      "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.absolute.top-0.left-0.w-full.bg-white.z-\\[999\\] > div:nth-child(2)",
    ).style.display = "block";
    let nodeList = document.querySelector(
      "#contact-details > div > div.relative.p-0.hl_contact-details-left > div > div.h-full.overflow-y-auto.search-container",
    ).childNodes; // the element ids are randomized across the subaccounts, so we have to select them as child nodes
    nodeList[9].style.display = "block"; // contact
    nodeList[10].style.display = "block"; // general info
    nodeList[11].style.display = "block"; // additional info
  }
}

function DeleteElems() {
  // JACOB TODO: name each element being deleted in comments
  document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(11)",
  ).style.display = "none";
  document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(12)",
  ).style.display = "none";
  document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(14)",
  ).style.display = "none";
  document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(1)",
  ).style.display = "none";
  document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left > span.bulk-actions-list > span:nth-child(8)",
  ).style.display = "none";
}

function addSchoolContactButton() {
  console.log("Adding School Contact Button");

  let schoolContactButton = document.createElement("schoolContactButton");
  schoolContactButton.innerHTML = `
      <span
        data-v-0c055ff2=""
        data-tooltip="tooltip"
        data-placement="top"
        title="Add School Contact"
        id="schoolContactButton"
        onclick="addForm()" >
            <button
            data-v-0c055ff2=""
            type="button"
            data-original-title="Add School Contact"
            class="btn btn-light btn-sm">

            <i class="fas fa-school" style="position: relative;left: -1px;"></i>
            </button>
        </span>
`;

  let listElement = document.querySelector(
    "#smartlists > div.hl_controls.hl_smartlists--controls > div.hl_controls--left",
  );

  listElement.insertBefore(schoolContactButton, listElement.children[1]); // append it, but make it first.

  // add eventListeners to display tooltip when hovering over
  schoolContactButton.addEventListener("mouseover", () => {
    let offsetX = 0;
    // This is to account for the menu's being opened or not. If the menu is open, the tooltip will be off by a bit.
    if (
      document
        .querySelector(
          "#sidebar-v2 > div.sm\\:hidden.lg\\:block.xl\\:block.absolute.-right-2.bottom-5.z-50 > button",
        )
        .innerHTML.includes("fa-chevron-circle-left")
    ) {
      offsetX = 250;
    } else {
      offsetX = 83;
    }
    let body = document.querySelector("body");
    let tooltipElem = document.createElement("addSchoolTooltip");
    tooltipElem.id = "addSchoolTooltip";
    tooltipElem.innerHTML =
      `<div id="__bv_tooltip_167__addSchoolTooltip" role="tooltip" tabindex="-1" data-v-0c055ff2="" class="tooltip b-tooltip bs-tooltip-top" x-placement="top" style="position: absolute; transform: translate3d(` +
      offsetX +
      `px, 141px, 0px); top: 0px; left: 0px; will-change: transform;"><div class="arrow" style="left: 50px;"></div><div class="tooltip-inner">Add School Contact</div></div>`;
    body.append(tooltipElem);
  });

  schoolContactButton.addEventListener("mouseout", () => {
    document.getElementById("addSchoolTooltip").remove();
  });
}

try {
  // if this script is loaded twice, these functions will already exist. This prevents an "already declared" error.

  function pasteLink() {
    getClipboard();
  }

  async function getClipboard() {
    await navigator.clipboard.readText().then((text) => {
      document.getElementById("ASClogo").value = text;
    });
  }

  function addForm() {
    document.getElementById("customFormWrapper").style.display = "block";
  }

  function closeForm() {
    document.getElementById("customFormWrapper").style.display = "none";
  }

  function addUploadWindow(event) {
    event.preventDefault();

    document.getElementById("addFormHTML").style.display = "none";
    document.getElementById("uploadIframeWindow").style.display = "block";
  }

  function closeUpload() {
    document.getElementById("uploadIframeWindow").style.display = "none";
    document.getElementById("addFormHTML").style.display = "block";
  }

  function submitForm(event) {
    event.preventDefault(); // prevent it from going to another page. Not sure why it does this

    const firebaseConfig = {
      apiKey: "AIzaSyAkvl6HKgup1AofIrUU_Q7b4RlvhI2QTpc",
      authDomain: "kairos-test-eedd6.firebaseapp.com",
      projectId: "kairos-test-eedd6",
      storageBucket: "kairos-test-eedd6.appspot.com",
      messagingSenderId: "34445244935",
      appId: "1:34445244935:web:b4ed7e9be70c16251d88a2",
      measurementId: "G-M1BXTKSG3B",
    };

    firebase.initializeApp(firebaseConfig, "newContact");

    const firestore = firebase.app("newContact").firestore();
    let locationSA = window.location.href.split("/")[5];
    let accessTokenP = "";
    let contactP =
      `{
      "firstName": "School",
      "lastName": "Contact",
      "companyName": "` +
      document.getElementById("ASCname").value +
      `",
      "locationId": "` +
      locationSA +
      `",
      "dnd": true,
      "tags": [
        "school",
        "` +
      document.getElementById("ASCname").value +
      `"
      ],
      "customFields": [
              {
                "key": "school_name",
                "field_value": "` +
      document.getElementById("ASCname").value +
      `"
              },
              {
                "key": "mascot",
                "field_value": "` +
      document.getElementById("ASCmascot").value +
      `"
              },
              {
                "key": "school_location",
                "field_value": "` +
      document.getElementById("ASClocation").value +
      `"
              },
              {
                "key": "school_logo_link",
                "field_value": "` +
      document.getElementById("ASClogo").value +
      `"
              },
              {
                "key": "last_updated",
                "field_value": "` +
      new Date().toISOString() +
      `"
              }
            ]
          }`;

    firestore // grab the location access key from Firebase
      .collection("tokens")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          //console.log("Entry: ", entry);
          if (doc.id == locationSA) {
            //console.log(doc.data().locationAccessToken);
            accessTokenP = doc.data().locationAccessToken;
          }
        });
      })
      .then(() => {
        // after location token acquired, create the contact
        if (accessTokenP == "") {
          console.log("Location not found in FB!");
        } else {
          createContact(accessTokenP, contactP).then(() => {
            createSmartList(
              // create a smart list containing that school contact
              window.location.href.split("/")[5],
              document.getElementById("ASCname").value,
            );
          });
        }
      });

    closeForm();
  }

  async function createContact(tokenX, contactX) {
    const url = "https://services.leadconnectorhq.com/contacts/";
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + tokenX,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: contactX,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createSmartList(SMlocation, SMname) {
    const owner = "kairoscloud";
    const repo = "tokenrefresh";
    const workflow_id = "playwright.yml";
    const githubToken = globalGitPat;

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
    const data = {
      ref: "main",
      inputs: {
        SMlocationID: SMlocation,
        schoolName: SMname,
      },
    };
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Workflow triggered successfully");
    } catch (error) {
      console.error("Failed to trigger workflow", error.message);
    }
  }
} catch (error) {}

// checks if the current location is jostens or not
function allowedLocation() {
  // if (globalLocationList != []) {
  //   // newLocation.js doesn't instantly fill the list, so we wait until it has contents
  //   let pagelocation = window.location.href.split("/")[5];
  //   // console.log(globalLocationList);
  //   return (
  //     globalLocationList.find((obj) => obj.id === pagelocation)?.isJostens ==
  //     "true"
  //   );
  // }
  // return true; // default option

  if (document.querySelector("body")) {
    return document.querySelector(".jostens");
  }
}
