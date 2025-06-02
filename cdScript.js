let cdScript_ver = 2;
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

  (function () {
    "use strict";

    const SELECTORS = {
      // --- Campaign Details Page Selectors (Adapted to New HTML) ---
      campaignUseCaseLabel:
        "#FormMessagingUsecase > div > div.n-form-item > label > span.n-form-item-label__text", // Adjusted
      useCaseDescriptionContainer: "#ExampleUsecaseDescription",
      sampleMessage1Container: "#ExampleSampleMessage1",
      sampleMessage2Container: "#ExampleSampleMessage2",
      // Textareas (if direct manipulation is intended, though popups are for copying)
      // useCaseDescriptionTextarea: "#InputUsecaseDescription textarea",
      // sampleMessage1Textarea: "#InputMessage1 textarea",
      // sampleMessage2Textarea: "#InputMessage2 textarea",

      // --- Next Page (User Consent) Selectors (Assumed based on original, might need adjustment for new HTML if that part also changed) ---
      contactConsentLabel:
        "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text", // This ID might change in the new structure. The new HTML shows #LayoutA2PWizardStepPane which likely reloads content.
      userConsentContainer: "#ExampleUserConsent", // Assuming this ID will appear on the next step
      optInMessageContainer: "#ExampleOptInMessage", // Assuming this ID will appear on the next step
      // userConsentTextarea: "#InputHowLeadsConsent textarea", // Guessed, might need adjustment
      // optInMessageTextarea: "#InputOptInMessage textarea",  // Guessed, might need adjustment
    };

    const POPUP_DATA_CAMPAIGN_DETAILS = [
      {
        id: "useCaseDescription",
        triggerContainerSelector: SELECTORS.useCaseDescriptionContainer,
        title: "Use Case Description",
        text: "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.",
        copyText:
          "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.",
      },
      {
        id: "sampleMessage1",
        triggerContainerSelector: SELECTORS.sampleMessage1Container,
        title: "Sample Message #1 Examples",
        text: "Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.",
        copyText:
          "Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.",
      },
      {
        id: "sampleMessage2",
        triggerContainerSelector: SELECTORS.sampleMessage2Container,
        title: "Sample Message #2 Examples",
        text: "Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.",
        copyText:
          "Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.",
      },
    ];

    const POPUP_DATA_USER_CONSENT = [
      {
        id: "exampleUserConsent",
        triggerContainerSelector: SELECTORS.userConsentContainer,
        title: "User Consent Examples",
        text: "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].",
        copyText:
          "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].",
      },
      {
        id: "exampleOptIn",
        triggerContainerSelector: SELECTORS.optInMessageContainer,
        title: "Opt-In Message Examples",
        text: "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.",
        copyText:
          "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.",
      },
    ];

    let popupInsertable = null;
    let clickableBackground = null;
    let clickableBackground2 = null; // For the second page, as per original logic

    function waitForElement(
      selector,
      callback,
      timeout = 20000,
      checkInterval = 500,
    ) {
      let elapsedTime = 0;
      const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(intervalId);
          callback(element);
        } else {
          elapsedTime += checkInterval;
          if (elapsedTime >= timeout) {
            clearInterval(intervalId);
            console.warn(`Element ${selector} not found after ${timeout}ms.`);
          }
        }
      }, checkInterval);
      return intervalId;
    }

    function createSeeExampleLinkHtml(popupId) {
      return `
              <div class="flex" style="cursor: pointer;" data-popup-id="${popupId}">
                  <span style="color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500">See example</span>
                  <svg style="margin: 4px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-4 w-4 text-gray-800">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"></path>
                  </svg>
              </div>`;
    }

    function createPopupHtml(title, contentText, copyTextValue) {
      // Using a unique data attribute for the copy button to avoid ID clashes
      const uniqueCopyId = `copy-btn-${Math.random().toString(36).substr(2, 9)}`;
      return `
              <div class="v-binder-follower-content" style="--v-target-width: 108px; --v-target-height: 20px; --v-offset-left: 0px; --v-offset-top: 0px; transform: translateX(0px) translateY(0px) translateX(-100%); transform-origin: right top;">
                  <div class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow" style="width: 400px; --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05); --n-text-color: rgba(52, 64, 84, 1); --n-color: #fff; --n-padding: 8px 14px;">
                      <div class="n-popover__header">
                          <span class="font-semibold text-gray-800">${title}</span>
                      </div>
                      <div class="n-popover__content">
                          <div class="flex flex-col gap-3">
                              <div class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3">
                                  <div class="text-gray-600 hl-text-sm-regular">${contentText}</div>
                                  <div class="custom-hidden items-center justify-start group-hover:flex" data-copy-button-id="${uniqueCopyId}" data-copy-text="${escape(copyTextValue)}" style="cursor:pointer;">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"></path>
                                      </svg>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="n-popover-arrow-wrapper"><div class="n-popover-arrow"></div></div>
                  </div>
              </div>`;
    }

    function setupPopupsAndBackground(backgroundId = "clickableBackground") {
      if (!document.getElementById("popupInsertableGlobal")) {
        popupInsertable = document.createElement("div");
        popupInsertable.className = "v-binder-follower-container";
        popupInsertable.id = "popupInsertableGlobal"; // Use a distinct ID
        popupInsertable.style.zIndex = "2001";
        document.body.appendChild(popupInsertable);
      } else {
        popupInsertable = document.getElementById("popupInsertableGlobal");
      }

      let bgElement = document.getElementById(backgroundId);
      if (!bgElement) {
        bgElement = document.createElement("div");
        bgElement.id = backgroundId;
        bgElement.style.cssText = `
                  display: none;
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: transparent; /* Or rgba(0,0,0,0.1) for slight dimming */
                  z-index: 2000;`;
        document.body.appendChild(bgElement);
      }

      bgElement.onclick = () => hideAllPopups(backgroundId);

      if (backgroundId === "clickableBackground")
        clickableBackground = bgElement;
      if (backgroundId === "clickableBackground2")
        clickableBackground2 = bgElement;

      return popupInsertable;
    }

    function setupPageExamples(popupDataArray, backgroundIdToUse) {
      const currentPopupInsertable =
        setupPopupsAndBackground(backgroundIdToUse);
      if (!currentPopupInsertable) {
        console.error("Popup insertable container not found or created.");
        return;
      }
      // Clear previous popups for this context if any, to prevent duplicates
      currentPopupInsertable
        .querySelectorAll(`[data-popup-for="${backgroundIdToUse}"]`)
        .forEach((p) => p.remove());

      popupDataArray.forEach((item) => {
        const triggerContainer = document.querySelector(
          item.triggerContainerSelector,
        );
        if (triggerContainer) {
          triggerContainer.innerHTML = createSeeExampleLinkHtml(item.id);
          const linkDiv = triggerContainer.querySelector(
            `[data-popup-id="${item.id}"]`,
          );
          if (linkDiv) {
            linkDiv.addEventListener("click", (event) => {
              event.stopPropagation();
              showPopup(
                item.id,
                item.triggerContainerSelector,
                backgroundIdToUse,
              );
            });
          }

          const popupElement = document.createElement("span");
          popupElement.id = `${item.id}Popup`;
          popupElement.style.display = "none";
          popupElement.style.zIndex = "2002";
          popupElement.setAttribute("data-popup-for", backgroundIdToUse); // Mark popup for current context
          popupElement.innerHTML = createPopupHtml(
            item.title,
            item.text,
            item.copyText,
          );
          currentPopupInsertable.appendChild(popupElement);

          // Attach event listener for the copy button
          const copyButton = popupElement.querySelector(`[data-copy-text]`);
          if (copyButton) {
            copyButton.addEventListener("click", (e) => {
              e.stopPropagation();
              const textToCopy = unescape(
                e.currentTarget.getAttribute("data-copy-text"),
              );
              copyToClipboard(textToCopy, backgroundIdToUse);
            });
          }
        } else {
          console.warn(
            `Trigger container ${item.triggerContainerSelector} not found for popup ${item.id}`,
          );
        }
      });
    }

    function showPopup(popupId, triggerElementSelector, backgroundIdToUse) {
      hideAllPopups(backgroundIdToUse); // Hide popups associated with the current background

      const popupElement = document.getElementById(`${popupId}Popup`);
      const triggerElement = document.querySelector(triggerElementSelector);
      const backgroundElement = document.getElementById(backgroundIdToUse);

      if (popupElement && triggerElement && backgroundElement) {
        const rect = triggerElement.getBoundingClientRect();
        const followerContent = popupElement.querySelector(
          ".v-binder-follower-content",
        );

        // Adjust positioning: typically popups appear below and aligned to the right of the trigger.
        // The original transform `translateX(-100%)` makes it align to the right edge.
        // `translateY` to move it below the trigger.
        let x = rect.right; // Align to the right edge of the trigger
        let y = rect.bottom + 5; // 5px below the trigger

        // This is a simplification. The original has more complex transforms based on v-placement.
        // For simplicity, we'll use a common positioning logic here.
        // If different popups need different alignments (top-end, bottom-end), this needs to be more sophisticated.
        let transformOrigin = "right top";
        let translateYTransform = `translateY(${y}px)`;

        // Example: if popup is supposed to be above (like sampleMessage1Popup in original)
        if (popupId.includes("sampleMessage")) {
          // A bit of a hack, better to store placement in POPUP_DATA
          y = rect.top - 5; // 5px above the trigger
          translateYTransform = `translateY(${y}px) translateY(-100%)`; // Move above and then shift by its own height
          transformOrigin = "right bottom";
        }

        if (followerContent) {
          followerContent.style.transform = `translateX(${x}px) ${translateYTransform} translateX(-100%)`;
          followerContent.style.transformOrigin = transformOrigin;
        }

        popupElement.style.display = "block";
        backgroundElement.style.display = "block";
      } else {
        if (!popupElement)
          console.error(`Popup element for ${popupId}Popup not found.`);
        if (!triggerElement)
          console.error(`Trigger element ${triggerElementSelector} not found.`);
        if (!backgroundElement)
          console.error(`Background element ${backgroundIdToUse} not found.`);
      }
    }

    function hideAllPopups(backgroundIdToFilterBy = null) {
      // Hide popups associated with a specific background, or all if no filter
      const popupsToHide = popupInsertable
        ? backgroundIdToFilterBy
          ? popupInsertable.querySelectorAll(
              `[data-popup-for="${backgroundIdToFilterBy}"]`,
            )
          : popupInsertable.children
        : [];

      for (let popup of popupsToHide) {
        if (popup.style) popup.style.display = "none";
      }

      // Hide the specific background or all if no filter
      if (backgroundIdToFilterBy) {
        const bg = document.getElementById(backgroundIdToFilterBy);
        if (bg) bg.style.display = "none";
      } else {
        if (clickableBackground) clickableBackground.style.display = "none";
        if (clickableBackground2) clickableBackground2.style.display = "none";
      }
    }

    // Made globally accessible for the dynamically created copy buttons if needed,
    // but preferably called via event listener as implemented in setupPageExamples.
    window.copyToClipboard = function (text, backgroundIdToHide) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard");
          hideAllPopups(backgroundIdToHide);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };

    function initCampaignDetailsPageListeners() {
      console.log("Listening for campaign details page elements...");
      waitForElement(SELECTORS.campaignUseCaseLabel, (labelElement) => {
        // Removed .jostens check as it's not in the new HTML. Add equivalent if needed.
        // if (document.querySelector(SELECTORS.jostensElement)) { // Example if needed
        if (labelElement.innerText.trim() == "Campaign Use case") {
          labelElement.innerText = "Campaign Use case "; // Add space

          setupPageExamples(POPUP_DATA_CAMPAIGN_DETAILS, "clickableBackground");

          console.log(
            "Campaign details page processed. Listening for next page elements...",
          );
          initNextPageListeners(); // Start listening for the next page
        }
        // }
      });
    }

    function initNextPageListeners() {
      waitForElement(
        SELECTORS.contactConsentLabel,
        (labelElement) => {
          if (
            labelElement.innerHTML.trim() ==
            "How do lead/contacts consent to receive messages?"
          ) {
            labelElement.innerHTML =
              "How do lead/contacts consent to receive messages? "; // Add space

            setupPageExamples(POPUP_DATA_USER_CONSENT, "clickableBackground2");

            console.log("Next page (User Consent) processed.");
            // If there's a third page/step, initiate listeners for it here.
            // No more intervals to clear for this specific step once processed.
          }
        },
        30000,
        3000,
      ); // Increased timeout, check every 3s for next page
    }

    // Start the process
    initCampaignDetailsPageListeners();
  })();
}
