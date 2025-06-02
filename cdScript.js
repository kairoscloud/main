let cdScript_ver = 3;
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

    const csvInput = `
  ,Use Case Description,Sample Message #1,Sample Message #2,How do lead/contacts consent to receive messages?,Opt-in Message
  Churches,"This campaign sends church event reminders, announcements, and notification messages to attendees of Coopersville Reformed Church who have opted-in to receive SMS from us. Our privacy policy can be found here (https://privacy.coopersvillereformed.com).","Hi John! This is Jackson from Coopersville Reformed Church. We wanted to remind you about our Easter services this Sunday at 8 AM, 9:30 AM, and 11 AM. Please reach out to (616) 625-0878 if you have any questions. Reply STOP to unsubscribe.",Hey Heather! This is Jackson from Coopersville Reformed Church. Thank you for signing up for the Women's Bible Study that meets on Tuesdays at 6pm. Would you like to learn about some of our other events? Visit here (https://coopersvillereformed.com/calendar) to learn more. Reply STOP to unsubscribe.,End users opt-in through a form on our website (https://coopersvillereformed.com/weekly-newsletter-sign-up) and filling in their details. Users check a box at the bottom of the form (https://storage.googleapis.com/msgsndr/fl8IRctskkM4pZ3fecNm/media/6836565100e93082f37094b2.png) to receive notifications & announcement messages from Coopersville Reformed Church in order to provide their consent and to confirm they have read our privacy policy (https://privacy.coopersvillereformed.com). Additionally end users can also text START to (616) 625-0878.,You have successfully opted-in to receive notification and announcement SMS from Coopersville Reformed Church. Please reply STOP if you need to Opt-out in the future.
  Jostens,"This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more. Our privacy policy can be found here (https://jostens.co/privacy-policy).","Hi John! This is [INSERT NAME] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here (https://jostens.co/freestate) for more info. Reply STOP to unsubscribe.",Hi Jane! This is [INSERT NAME] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [INSERT PHONE]. Reply STOP to unsubscribe.,"End users opt-in through a form on our website (https://us.jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website and privacy policy (https://jostens.co/privacy-policy). New contacts check a box at the bottom of the form (https://storage.googleapis.com/msgsndr/yfyIrXrm61r57rx3ex4N/media/683ddc204da9cd94ad14f830.png) to receive order notifications & promotional messages from Jostens when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [INSERT PHONE].",You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.
  Prompts,I'm reaching out for an update on the status of my A2P Campaign Registration for Brand SID #. I submitted this quite some time ago. We're eager to begin sending text messages. Any help would be appreciated. Thank you!,I'm reaching out for help diagnosing my A2P Campaign Registration for Brand SID #. We have submitted multiple attempts and keep being rejected. Could you review our recent submissions and help with what we're missing? We've reviewed Twilio's documentation on this and tried to be as thorough as possible. We're eager to begin sending text messages. Any help would be appreciated. Thank you!,,,
  `;

    // Constants for CSV column header keys used in the templates object
    const CSV_COLUMN_KEYS = {
      USE_CASE_DESCRIPTION: "Use Case Description",
      SAMPLE_MESSAGE_1: "Sample Message #1",
      SAMPLE_MESSAGE_2: "Sample Message #2",
      HOW_LEADS_CONSENT: "How do lead/contacts consent to receive messages?",
      OPT_IN_MESSAGE: "Opt-in Message",
    };

    function parseCsvToTemplates(csvString) {
      const lines = csvString.trim().split("\n");
      if (lines.length < 2) return {}; // Not enough data (header + at least one data row)

      const rawHeaders = lines[0].split(",");
      const contentHeaders = rawHeaders.slice(1).map((h) => h.trim()); // Actual content headers
      const templates = {};

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        let values = [];
        let inQuotes = false;
        let currentValue = "";

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            if (inQuotes && j + 1 < line.length && line[j + 1] === '"') {
              currentValue += '"'; // Escaped quote
              j++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            values.push(currentValue);
            currentValue = "";
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue); // Add the last value

        // Remove surrounding quotes from parsed values and unescape double quotes
        values = values.map((val) => {
          let processedVal = val.trim();
          if (processedVal.startsWith('"') && processedVal.endsWith('"')) {
            processedVal = processedVal.substring(1, processedVal.length - 1);
          }
          return processedVal.replace(/""/g, '"'); // Unescape "" to "
        });

        const scenarioKey = values[0];
        if (!scenarioKey) continue;

        templates[scenarioKey] = {};
        contentHeaders.forEach((header, index) => {
          templates[scenarioKey][header] = values[index + 1] || ""; // Default to empty string if undefined
        });
      }
      return templates;
    }

    const ALL_APP_TEMPLATES = parseCsvToTemplates(csvInput);

    let activeScenarioKey = "";
    // Default to Jostens if the specific Church URL part is not found.
    if (window.location.href.includes("fl8IRctskkM4pZ3fecNm")) {
      activeScenarioKey = "Churches";
    } else {
      activeScenarioKey = "Jostens";
    }

    const currentScenarioTemplates = ALL_APP_TEMPLATES[activeScenarioKey];

    if (!currentScenarioTemplates) {
      console.error(
        `Templates for scenario "${activeScenarioKey}" not found. Check CSV data and scenario detection.`,
      );
      return; // Stop script execution if templates are missing
    }

    const SELECTORS = {
      campaignUseCaseLabel:
        "#FormMessagingUsecase > div > div.n-form-item > label > span.n-form-item-label__text",
      useCaseDescriptionContainer: "#ExampleUsecaseDescription",
      sampleMessage1Container: "#ExampleSampleMessage1",
      sampleMessage2Container: "#ExampleSampleMessage2",
      contactConsentLabel:
        "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text",
      userConsentContainer: "#ExampleUserConsent",
      optInMessageContainer: "#ExampleOptInMessage",
    };

    // Dynamically build POPUP_DATA arrays based on the active scenario's templates
    let DYNAMIC_POPUP_DATA_CAMPAIGN_DETAILS = [
      {
        id: "useCaseDescription",
        triggerContainerSelector: SELECTORS.useCaseDescriptionContainer,
        title: "Use Case Description",
        text: currentScenarioTemplates[CSV_COLUMN_KEYS.USE_CASE_DESCRIPTION],
        copyText:
          currentScenarioTemplates[CSV_COLUMN_KEYS.USE_CASE_DESCRIPTION],
      },
      {
        id: "sampleMessage1",
        triggerContainerSelector: SELECTORS.sampleMessage1Container,
        title: "Sample Message #1 Examples",
        text: currentScenarioTemplates[CSV_COLUMN_KEYS.SAMPLE_MESSAGE_1],
        copyText: currentScenarioTemplates[CSV_COLUMN_KEYS.SAMPLE_MESSAGE_1],
      },
      {
        id: "sampleMessage2",
        triggerContainerSelector: SELECTORS.sampleMessage2Container,
        title: "Sample Message #2 Examples",
        text: currentScenarioTemplates[CSV_COLUMN_KEYS.SAMPLE_MESSAGE_2],
        copyText: currentScenarioTemplates[CSV_COLUMN_KEYS.SAMPLE_MESSAGE_2],
      },
    ].filter((item) => item.text && item.text.trim() !== ""); // Filter out items with empty text

    let DYNAMIC_POPUP_DATA_USER_CONSENT = [
      {
        id: "exampleUserConsent",
        triggerContainerSelector: SELECTORS.userConsentContainer,
        title: "User Consent Examples",
        text: currentScenarioTemplates[CSV_COLUMN_KEYS.HOW_LEADS_CONSENT],
        copyText: currentScenarioTemplates[CSV_COLUMN_KEYS.HOW_LEADS_CONSENT],
      },
      {
        id: "exampleOptIn",
        triggerContainerSelector: SELECTORS.optInMessageContainer,
        title: "Opt-In Message Examples",
        text: currentScenarioTemplates[CSV_COLUMN_KEYS.OPT_IN_MESSAGE],
        copyText: currentScenarioTemplates[CSV_COLUMN_KEYS.OPT_IN_MESSAGE],
      },
    ].filter((item) => item.text && item.text.trim() !== ""); // Filter out items with empty text

    // --- Rest of the original script logic (popup creation, event handlers, etc.) ---
    let popupInsertable = null;
    let clickableBackground = null;
    let clickableBackground2 = null;

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
                                  <div class="text-gray-600 hl-text-sm-regular" style="white-space: pre-wrap;">${contentText}</div>
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
        popupInsertable.id = "popupInsertableGlobal";
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
                  background-color: transparent;
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
      currentPopupInsertable
        .querySelectorAll(`[data-popup-for="${backgroundIdToUse}"]`)
        .forEach((p) => p.remove());

      popupDataArray.forEach((item) => {
        if (!item.text || item.text.trim() === "") {
          // Extra check, though filtering is done earlier
          return;
        }
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
          popupElement.setAttribute("data-popup-for", backgroundIdToUse);
          popupElement.innerHTML = createPopupHtml(
            item.title,
            item.text,
            item.copyText,
          );
          currentPopupInsertable.appendChild(popupElement);

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
      hideAllPopups(backgroundIdToUse);

      const popupElement = document.getElementById(`${popupId}Popup`);
      const triggerElement = document.querySelector(triggerElementSelector);
      const backgroundElement = document.getElementById(backgroundIdToUse);

      if (popupElement && triggerElement && backgroundElement) {
        const rect = triggerElement.getBoundingClientRect();
        const followerContent = popupElement.querySelector(
          ".v-binder-follower-content",
        );

        let x = rect.right;
        let y = rect.bottom + 5;
        let transformOrigin = "right top";
        let translateYTransform = `translateY(${y}px)`;

        if (popupId.includes("sampleMessage")) {
          y = rect.top - 5;
          translateYTransform = `translateY(${y}px) translateY(-100%)`;
          transformOrigin = "right bottom";
        }

        // Position the popup relative to the viewport, then apply transforms
        // The popupElement itself is appended to popupInsertable (often body or similar)
        // So, its initial position is not relative to triggerElement.
        // The v-binder-follower-content is what gets transformed.
        // We set left/top for the popupElement to align with triggerElement.
        // Then adjust transform on followerContent.

        popupElement.style.position = "absolute"; // or 'fixed' if popupInsertable is body
        popupElement.style.left = "0px"; // Use transform for positioning
        popupElement.style.top = "0px"; // Use transform for positioning

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
      const popupsToHide = popupInsertable
        ? backgroundIdToFilterBy
          ? popupInsertable.querySelectorAll(
              `[data-popup-for="${backgroundIdToFilterBy}"]`,
            )
          : popupInsertable.children
        : [];

      for (let i = 0; i < popupsToHide.length; i++) {
        // Use standard for loop for HTMLCollection
        if (popupsToHide[i].style) popupsToHide[i].style.display = "none";
      }

      if (backgroundIdToFilterBy) {
        const bg = document.getElementById(backgroundIdToFilterBy);
        if (bg) bg.style.display = "none";
      } else {
        if (clickableBackground) clickableBackground.style.display = "none";
        if (clickableBackground2) clickableBackground2.style.display = "none";
      }
    }

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
        if (labelElement.innerText.trim() === "Campaign Use case") {
          // Exact match
          labelElement.innerText = "Campaign Use case "; // Add space

          // Use the dynamically generated popup data
          if (DYNAMIC_POPUP_DATA_CAMPAIGN_DETAILS.length > 0) {
            setupPageExamples(
              DYNAMIC_POPUP_DATA_CAMPAIGN_DETAILS,
              "clickableBackground",
            );
          } else {
            console.log(
              "No campaign detail examples to show for this scenario.",
            );
          }

          console.log(
            "Campaign details page processed. Listening for next page elements...",
          );
          initNextPageListeners();
        }
      });
    }

    function initNextPageListeners() {
      waitForElement(
        SELECTORS.contactConsentLabel,
        (labelElement) => {
          if (
            labelElement.innerHTML.trim() === // Use innerHTML if it might contain entities
            "How do lead/contacts consent to receive messages?"
          ) {
            labelElement.innerHTML =
              "How do lead/contacts consent to receive messages? ";

            // Use the dynamically generated popup data
            if (DYNAMIC_POPUP_DATA_USER_CONSENT.length > 0) {
              setupPageExamples(
                DYNAMIC_POPUP_DATA_USER_CONSENT,
                "clickableBackground2",
              );
            } else {
              console.log(
                "No user consent examples to show for this scenario.",
              );
            }
            console.log("Next page (User Consent) processed.");
          }
        },
        30000,
        3000,
      );
    }

    initCampaignDetailsPageListeners();
  })();
}
