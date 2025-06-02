let cdScript_ver = 1;
// The Kairos Cloud Campaign Details Script
// What does it do?
// - Adds some prompts to settings -> phone numbers -> trust center. Basically to speed-up the A2P verification/trust process for new users
// - The prompts:
// - Use Case Description:
// -   This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.
// - Sample Message #1:
// -   Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.
// - Sample Message #2:
// -   Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.
// - How do lead/contacts consent to receive messages?:
// -  End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. We encourage all new contacts to read our Privacy Policy before giving consent (jostens.co/privacy-policy). New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].
// - Opt-in Message:
// -   You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.
//
// Runs on https://app.kairoscloud.io/v2/location/*/settings/phone_number?tab=trust-center
// Loads from https://kairoscloud.github.io/main/campaignDetailsScript.js
// Jacob Westra – jacob@thekairosmedia.com

let cdScript_id = "cdScript"; // autoload form id later
let cdScript_hash = hash(document.currentScript.textContent).substring(4); // last 4 hex digits of hash
console.log(cdScript_id + " v" + cdScript_ver + "-" + cdScript_hash); // format: id v00-ffff
active[cdScript_id] = Date.now();

// declare global variables
// why put them in the global scope? It's useful to have them available in the console for debugging purposes
// all variables will be reset when main is called again

// called on initialization or restart
main_cdScript();
function main_cdScript() {
  // this is just protocol as defined by the script loader
  // it's not necessary for the functionality of the rest of the script
  // it's just a way to keep track of the script's status
  let activeUpdateIntv = setInterval(() => {
    active[cdScript_id] = Date.now();
    if (stop[cdScript_id]) {
      clearInterval(activeUpdateIntv);
      console.log(cdScript_id + " stopped!");
    }
  }, 2000);

  // --- Configuration ---
  const SELECTORS = {
    campaignDetails: {
      // Updated selector based on the new HTML structure provided for FormMessagingUsecase
      // This assumes the first n-form-item under FormMessagingUsecase is the target.
      // Original: #FormMessagingUsecase > div > div.n-form-item... > label > span.n-form-item-label__text
      // The new HTML shows a similar structure.
      label:
        "#FormMessagingUsecase .n-form-item label .n-form-item-label__text", // More generic but should work if it's the first/only one
      // For more specificity, if needed, based on the provided HTML:
      // label: "#FormMessagingUsecase > div.grid.auto-rows-max > div.n-form-item:nth-child(1) > label > span.n-form-item-label__text",
      useCaseDescriptionPlaceholder: "#ExampleUsecaseDescription",
      sampleMessage1Placeholder: "#ExampleSampleMessage1",
      sampleMessage2Placeholder: "#ExampleSampleMessage2",
    },
    nextPage: {
      // This selector is from the original code. The provided HTML doesn't cover this "next page".
      // Assuming it's still valid when that page loads.
      label:
        "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text",
      userConsentPlaceholder: "#ExampleUserConsent",
      optInMessagePlaceholder: "#ExampleOptInMessage",
    },
    // It's good practice to give specific IDs to textareas if you need to interact with them
    // For example, if you wanted to fill them:
    // useCaseDescriptionInput: "#InputUsecaseDescription textarea",
    // sampleMessage1Input: "#InputMessage1 textarea",
    // sampleMessage2Input: "#InputMessage2 textarea",
  };

  const TEXT_CONTENT = {
    campaignDetailsLabel: "Campaign Use case",
    nextPageLabel: "How do lead/contacts consent to receive messages?",
  };

  const POPUP_IDS = {
    container: "customPopupContainer",
    background: "customClickableBackground",
    useCaseDescription: "customUseCaseDescriptionPopup",
    sampleMessage1: "customSampleMessage1Popup",
    sampleMessage2: "customSampleMessage2Popup",
    userConsent: "customUserConsentPopup",
    optIn: "customOptInPopup",
  };

  const CHECK_INTERVAL = 2000; // ms
  const NEXT_PAGE_CHECK_INTERVAL = 3000; // ms
  const ELEMENT_WAIT_TIMEOUT = 30000; // 30 seconds for elements to appear

  // --- State ---
  let intervals = {
    checkCampaignDetails: null,
    checkNextPage: null,
  };
  let sharedUI = {
    popupContainer: null,
    clickableBackground: null,
  };

  // --- Utility Functions ---
  function query(selector) {
    return document.querySelector(selector);
  }

  function createDOMElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const key in attributes) {
      if (key === "style" && typeof attributes[key] === "object") {
        Object.assign(element.style, attributes[key]);
      } else if (key === "className") {
        element.className = attributes[key];
      } else if (key === "innerHTML") {
        element.innerHTML = attributes[key];
      } else if (
        key.startsWith("on") &&
        typeof attributes[key] === "function"
      ) {
        element.addEventListener(
          key.substring(2).toLowerCase(),
          attributes[key],
        );
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }

  function waitForElement(
    selector,
    callback,
    timeout = ELEMENT_WAIT_TIMEOUT,
    checkFrequency = 500,
  ) {
    let ElemInterval = setInterval(() => {
      const element = query(selector);
      if (element) {
        clearInterval(ElemInterval);
        callback(element);
      }
    }, checkFrequency);

    setTimeout(() => {
      if (query(selector) === null) {
        // Check one last time
        clearInterval(ElemInterval);
        console.warn(`Element ${selector} not found after ${timeout}ms.`);
      }
    }, timeout);
    return ElemInterval; // Return interval ID so it can be managed if needed externally
  }

  function addSpaceIfNeeded(element, expectedText) {
    if (element && element.innerText.trim() === expectedText) {
      if (!element.innerText.endsWith(" ")) {
        element.innerText += " ";
      }
    }
  }

  // --- UI Creation and Management ---

  function createSharedPopUpInfrastructure() {
    if (!query(`#${POPUP_IDS.container}`)) {
      sharedUI.popupContainer = createDOMElement("div", {
        id: POPUP_IDS.container,
        className: "v-binder-follower-container", // Keep original class if layout depends on it
        style: {
          zIndex: "2001",
          position: "fixed",
          top: "0",
          left: "0",
          width: "0",
          height: "0",
        }, // Adjust if needed
      });
      document.body.appendChild(sharedUI.popupContainer);
    } else {
      sharedUI.popupContainer = query(`#${POPUP_IDS.container}`);
    }

    if (!query(`#${POPUP_IDS.background}`)) {
      sharedUI.clickableBackground = createDOMElement("div", {
        id: POPUP_IDS.background,
        style: {
          display: "none",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent", // Or 'rgba(0,0,0,0.1)' for slight dimming
          zIndex: "2000",
        },
        onclick: hideAllPopups,
      });
      document.body.appendChild(sharedUI.clickableBackground);
    } else {
      sharedUI.clickableBackground = query(`#${POPUP_IDS.background}`);
    }
  }

  function createSeeExampleHTML(text, svgIcon) {
    return `<div class='flex' style='cursor: pointer'>
                  <span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>${text}</span>
                  ${svgIcon}
              </div>`;
  }
  const SEE_EXAMPLE_SVG = `<svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg>`;
  const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600"><path stroke-linecap="round" stroke-linejoin="round" d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"></path></svg>`;

  function createPopupElement(
    id,
    title,
    exampleText,
    textToCopy,
    vPlacement = "bottom-end",
    initialTransform = "translateX(935px) translateY(260px) translateX(-100%)",
  ) {
    const popupContent = `
          <div class="v-binder-follower-content" v-placement="${vPlacement}" style="
              --v-target-width: 108px; /* These might need to be dynamic or removed if not always correct */
              --v-target-height: 20px;
              --v-offset-left: 0px;
              --v-offset-top: 0px;
              transform: ${initialTransform}; /* Will be updated on show */
              transform-origin: ${vPlacement.includes("bottom") ? "right top" : "right bottom"};
          ">
              <div class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow" style="width: 400px; /* other styles from original */">
                  <div class="n-popover__header">
                      <span class="font-semibold text-gray-800">${title}</span>
                  </div>
                  <div class="n-popover__content">
                      <div class="flex flex-col gap-3">
                          <div class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3">
                              <div class="text-gray-600 hl-text-sm-regular">${exampleText}</div>
                              <div class="custom-copy-button custom-hidden items-center justify-start group-hover:flex" data-copy-text="${textToCopy.replace(/"/g, '"')}">
                                  ${COPY_SVG}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="n-popover-arrow-wrapper"><div class="n-popover-arrow"></div></div>
              </div>
          </div>`;

    const popup = createDOMElement("span", {
      id: id,
      style: { display: "none", zIndex: "2002" },
      innerHTML: popupContent,
    });

    // Add event listener for the copy button
    const copyButton = popup.querySelector(".custom-copy-button");
    if (copyButton) {
      copyButton.addEventListener("click", function () {
        copyTextToClipboard(this.getAttribute("data-copy-text"));
      });
    }
    sharedUI.popupContainer.appendChild(popup);
    return popup;
  }

  function showPopup(popupId, triggerElement) {
    hideAllPopups(); // Hide others before showing a new one
    const popup = query(`#${popupId}`);
    if (popup && triggerElement && sharedUI.clickableBackground) {
      const rect = triggerElement.getBoundingClientRect();
      const popupContentDiv = popup.firstChild; // The div with class 'v-binder-follower-content'

      // Adjust x and y based on trigger. Add scroll offsets for fixed positioning.
      let x = rect.right + window.scrollX;
      let y = rect.bottom + window.scrollY;

      // Basic positioning: translateX(-100%) pulls it left by its own width.
      // v-placement suggests where the arrow points, so adjust accordingly.
      // This is a simplified positioning, might need fine-tuning based on actual v-placement behavior.
      let transform = `translateX(${x}px) translateY(${y}px) translateX(-100%)`;
      if (popupContentDiv.getAttribute("v-placement")?.includes("top")) {
        transform = `translateX(${x}px) translateY(${rect.top + window.scrollY}px) translateX(-100%) translateY(-100%)`;
      }

      popupContentDiv.style.transform = transform;
      popup.style.display = "block";
      sharedUI.clickableBackground.style.display = "block";
    } else {
      console.warn("Popup or trigger element not found for:", popupId);
    }
  }

  function hideAllPopups() {
    if (sharedUI.clickableBackground)
      sharedUI.clickableBackground.style.display = "none";
    const popups = sharedUI.popupContainer
      ? sharedUI.popupContainer.children
      : [];
    for (let popup of popups) {
      if (popup.style) popup.style.display = "none";
    }
  }

  function copyTextToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Optional: Show a success message
        // alert("Copied to clipboard!");
        hideAllPopups();
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        hideAllPopups(); // Still hide popups even if copy fails
      });
  }

  // --- Page Specific Logic ---

  function setupCampaignDetailsPage() {
    console.log("Setting up Campaign Details page helpers...");
    createSharedPopUpInfrastructure();

    const useCaseDescPlaceholder = query(
      SELECTORS.campaignDetails.useCaseDescriptionPlaceholder,
    );
    if (useCaseDescPlaceholder) {
      useCaseDescPlaceholder.innerHTML = createSeeExampleHTML(
        "See example",
        SEE_EXAMPLE_SVG,
      );
      useCaseDescPlaceholder.firstChild.addEventListener("click", () =>
        showPopup(POPUP_IDS.useCaseDescription, useCaseDescPlaceholder),
      );
      createPopupElement(
        POPUP_IDS.useCaseDescription,
        "Use Case Description",
        "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.",
        "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.",
        "bottom-end",
      );
    }

    const sampleMsg1Placeholder = query(
      SELECTORS.campaignDetails.sampleMessage1Placeholder,
    );
    if (sampleMsg1Placeholder) {
      sampleMsg1Placeholder.innerHTML = createSeeExampleHTML(
        "See example",
        SEE_EXAMPLE_SVG,
      );
      sampleMsg1Placeholder.firstChild.addEventListener("click", () =>
        showPopup(POPUP_IDS.sampleMessage1, sampleMsg1Placeholder),
      );
      createPopupElement(
        POPUP_IDS.sampleMessage1,
        "Sample Message #1 Examples",
        "Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.",
        "Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.",
        "top-end",
      );
    }

    const sampleMsg2Placeholder = query(
      SELECTORS.campaignDetails.sampleMessage2Placeholder,
    );
    if (sampleMsg2Placeholder) {
      sampleMsg2Placeholder.innerHTML = createSeeExampleHTML(
        "See example",
        SEE_EXAMPLE_SVG,
      );
      sampleMsg2Placeholder.firstChild.addEventListener("click", () =>
        showPopup(POPUP_IDS.sampleMessage2, sampleMsg2Placeholder),
      );
      createPopupElement(
        POPUP_IDS.sampleMessage2,
        "Sample Message #2 Examples",
        "Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.",
        "Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.",
        "top-end",
      );
    }

    // Start listening for the next page criteria
    intervals.checkNextPage = waitForElement(
      SELECTORS.nextPage.label,
      (nextPageLabelElement) => {
        if (intervals.checkNextPage) clearInterval(intervals.checkNextPage); // Clear self
        addSpaceIfNeeded(nextPageLabelElement, TEXT_CONTENT.nextPageLabel);
        if (
          nextPageLabelElement.innerText.trim() ===
            TEXT_CONTENT.nextPageLabel ||
          nextPageLabelElement.innerText.trim() ===
            TEXT_CONTENT.nextPageLabel + " "
        ) {
          // Check with or without space
          console.log("Next page detected, setting up helpers...");
          setupNextPageHelpers();
        }
      },
      ELEMENT_WAIT_TIMEOUT,
      NEXT_PAGE_CHECK_INTERVAL,
    );
  }

  function setupNextPageHelpers() {
    console.log("Setting up Next Page helpers...");
    // Ensure shared UI is there (though it should be from previous step)
    createSharedPopUpInfrastructure();

    const userConsentPlaceholder = query(
      SELECTORS.nextPage.userConsentPlaceholder,
    );
    if (userConsentPlaceholder) {
      userConsentPlaceholder.innerHTML = createSeeExampleHTML(
        "See example",
        SEE_EXAMPLE_SVG,
      );
      userConsentPlaceholder.firstChild.addEventListener("click", () =>
        showPopup(POPUP_IDS.userConsent, userConsentPlaceholder),
      );
      createPopupElement(
        POPUP_IDS.userConsent,
        "User Consent Examples",
        "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].",
        "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].",
        "bottom-end",
      );
    }

    const optInMsgPlaceholder = query(
      SELECTORS.nextPage.optInMessagePlaceholder,
    );
    if (optInMsgPlaceholder) {
      optInMsgPlaceholder.innerHTML = createSeeExampleHTML(
        "See example",
        SEE_EXAMPLE_SVG,
      );
      optInMsgPlaceholder.firstChild.addEventListener("click", () =>
        showPopup(POPUP_IDS.optIn, optInMsgPlaceholder),
      );
      createPopupElement(
        POPUP_IDS.optIn,
        "Opt-In Message Examples",
        "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.",
        "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.",
        "top-end",
      );
    }
    console.log("Next page setup complete.");
  }

  // --- Initialization ---
  function main() {
    console.log("Starting Campaign Helper Script...");

    intervals.checkCampaignDetails = waitForElement(
      SELECTORS.campaignDetails.label,
      (campaignLabelElement) => {
        // The .jostens check was removed as it's not in the new HTML.
        // If it's a critical check for being on the right page,
        // you might need an alternative way to confirm the page context.
        // For example, checking for a specific URL pattern or another unique element.
        // E.g. if (!document.querySelector(".some-other-critical-marker")) return;

        // Check if the label text matches "Campaign Use case"
        if (
          campaignLabelElement.innerText.trim() ===
          TEXT_CONTENT.campaignDetailsLabel
        ) {
          if (intervals.checkCampaignDetails)
            clearInterval(intervals.checkCampaignDetails); // Clear self

          addSpaceIfNeeded(
            campaignLabelElement,
            TEXT_CONTENT.campaignDetailsLabel,
          );
          console.log("Campaign details page identified. Setting up helpers.");
          setupCampaignDetailsPage();
        } else {
          // Label found, but text doesn't match. Keep polling or decide to stop.
          // For now, this interval continues until timeout if text doesn't match.
          console.log(
            `Found label, but text is "${campaignLabelElement.innerText.trim()}", expected "${TEXT_CONTENT.campaignDetailsLabel}"`,
          );
        }
      },
      ELEMENT_WAIT_TIMEOUT,
      CHECK_INTERVAL,
    );
  }

  // Run the main function
  // It's often good to wait for DOMContentLoaded or a small delay
  // if the script is injected very early.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
}
