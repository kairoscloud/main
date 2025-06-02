let cdScript_ver = 0;
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

  let checkIfCampaignDetailsInterval = setInterval(() => {
    //console.log("Listening for campaign details...");
    if (
      document.querySelector(
        "#FormMessagingUsecase > div > div.n-form-item.n-form-item--medium-size.n-form-item--top-labelled.hl-form-item > label > span.n-form-item-label__text",
      ) &&
      document.querySelector(".jostens")
    ) {
      if (
        document.querySelector(
          "#FormMessagingUsecase > div > div.n-form-item.n-form-item--medium-size.n-form-item--top-labelled.hl-form-item > label > span.n-form-item-label__text",
        ).innerText == "Campaign Use case"
      ) {
        document.querySelector(
          "#FormMessagingUsecase > div > div.n-form-item.n-form-item--medium-size.n-form-item--top-labelled.hl-form-item > label > span.n-form-item-label__text",
        ).innerText = "Campaign Use case "; // add space
        campaignDetails();
        let checkIfNextPageInterval = setInterval(() => {
          if (
            document.querySelector(
              "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text",
            )
          ) {
            if (
              document.querySelector(
                "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text",
              ).innerHTML == "How do lead/contacts consent to receive messages?"
            ) {
              document.querySelector(
                "#FormContactInfo > div > div.forced-gap-1.relative.flex.flex-col > div > label > span.n-form-item-label__text",
              ).innerHTML =
                "How do lead/contacts consent to receive messages? "; // add space
              //alert("nextpage detected!");
              nextPage();
            }
          }
        }, 3000);
      }
    }
  }, 2000);

  function campaignDetails() {
    //alert("Found campaign details!");

    // the 3 drop-down menus

    document.querySelector("#ExampleUsecaseDescription").innerHTML =
      "<div class='flex' style='cursor: pointer' onclick='useCaseDescription()'><span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>See example</span> <svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg></div>";

    document.querySelector("#ExampleSampleMessage1").innerHTML =
      "<div class='flex' style='cursor: pointer' onclick='sampleMessage1()'><span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>See example</span> <svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg></div>";

    document.querySelector("#ExampleSampleMessage2").innerHTML =
      "<div class='flex' style='cursor: pointer' onclick='sampleMessage2()'><span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>See example</span> <svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg></div>";

    // Popup insertable

    let popupInsertable = document.createElement("div");
    popupInsertable.className = "v-binder-follower-container";
    popupInsertable.id = "popupInsertable";
    popupInsertable.style = "z-index: 2001";
    document.body.appendChild(popupInsertable);

    // clickable background

    let background = document.createElement("div");
    background.id = "clickableBackground";
    background.onclick = () => {
      document.getElementById("clickableBackground").style.display = "none";
      document.getElementById("useCaseDescriptionPopup").style.display = "none";
      document.getElementById("sampleMessage1Popup").style.display = "none";
      document.getElementById("sampleMessage2Popup").style.display = "none";
      // add more here
    };
    background.style = `
                  display: none;
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: transparent;
                  z-index: 2000;
      `;
    document.body.appendChild(background);

    // use case description

    let useCaseDescription = document.createElement("span");
    useCaseDescription.id = "useCaseDescriptionPopup";
    useCaseDescription.style = "display: none; z-index: 2002;";
    useCaseDescription.innerHTML = `<div class="v-binder-follower-content" v-placement="bottom-end" style="
              --v-target-width: 108px;
              --v-target-height: 20px;
              --v-offset-left: 0px;
              --v-offset-top: 0px;
              transform: translateX(935px) translateY(260px) translateX(-100%);
              --v-transform-origin: top right;
              transform-origin: right top;
          ">
          <div class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow" style="
                  width: 400px;
                  --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                      0 6px 16px 0 rgba(0, 0, 0, 0.08),
                      0 9px 28px 8px rgba(0, 0, 0, 0.05);
                  --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                  --n-bezier-ease-in: cubic-bezier(0.4, 0, 1, 1);
                  --n-bezier-ease-out: cubic-bezier(0, 0, 0.2, 1);
                  --n-font-size: 14px;
                  --n-text-color: rgba(52, 64, 84, 1);
                  --n-color: #fff;
                  --n-divider-color: rgb(239, 239, 245);
                  --n-border-radius: 3px;
                  --n-arrow-height: 6px;
                  --n-arrow-offset: 10px;
                  --n-arrow-offset-vertical: 10px;
                  --n-padding: 8px 14px;
                  --n-space: 6px;
                  --n-space-arrow: 10px;
              ">
              <div class="n-popover__header">
                  <span class="font-semibold text-gray-800">Use Case Description</span>
              </div>
              <div class="n-popover__content">
                  <div class="flex flex-col gap-3">
                      <div id="CopyTextBlock" class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3">
                          <div class="text-gray-600 hl-text-sm-regular">This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps &amp; gowns, class rings, letterman jackets, and more.</div>
                          <div class="custom-hidden items-center justify-start group-hover:flex" onclick="copyText('This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps &amp; gowns, class rings, letterman jackets, and more.')">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"></path>
                              </svg>
                          </div>
                      </div>


                  </div>
              </div>
              <!---->
              <div class="n-popover-arrow-wrapper">
                  <div class="n-popover-arrow"></div>
              </div>
          </div>
      </div>
  `;

    popupInsertable.appendChild(useCaseDescription);

    // sample message 1

    let sampleMessage1Popup = document.createElement("span");
    sampleMessage1Popup.id = "sampleMessage1Popup";
    sampleMessage1Popup.style = "display: none; z-index: 2002;";
    sampleMessage1Popup.innerHTML = `<div
        class="v-binder-follower-content"
        v-placement="top-end"
        style="
            --v-target-width: 108px;
            --v-target-height: 20px;
            --v-offset-left: 0px;
            --v-offset-top: 0px;
            transform: translateX(935px) translateY(499px) translateX(-100%)
                translateY(-100%);
            --v-transform-origin: bottom right;
            transform-origin: right bottom;
        "
    >
        <div
            class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow"
            style="
                width: 400px;
                --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                    0 6px 16px 0 rgba(0, 0, 0, 0.08),
                    0 9px 28px 8px rgba(0, 0, 0, 0.05);
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                --n-bezier-ease-in: cubic-bezier(0.4, 0, 1, 1);
                --n-bezier-ease-out: cubic-bezier(0, 0, 0.2, 1);
                --n-font-size: 14px;
                --n-text-color: rgba(52, 64, 84, 1);
                --n-color: #fff;
                --n-divider-color: rgb(239, 239, 245);
                --n-border-radius: 3px;
                --n-arrow-height: 6px;
                --n-arrow-offset: 10px;
                --n-arrow-offset-vertical: 10px;
                --n-padding: 8px 14px;
                --n-space: 6px;
                --n-space-arrow: 10px;
            "
        >
            <div class="n-popover__header">
                <span class="font-semibold text-gray-800"
                    >Sample Message #1 Examples</span
                >
            </div>
            <div class="n-popover__content">
                <div class="flex flex-col gap-3">
                    <div
                        id="CopyTextBlock"
                        class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3"
                    >
                        <div class="text-gray-600 hl-text-sm-regular">
                            Hi John! This is [insert name] from Jostens. It’s time
                            to order graduation products for your Senior! Please
                            take a moment and click the link below to watch a few
                            short videos to learn about the ordering process! Click
                            here: jostens.co/freestate. Reply STOP to unsubscribe.
                        </div>
                        <div
                            class="custom-hidden items-center justify-start group-hover:flex"
                            onclick="copyText('Hi John! This is [insert name] from Jostens. It’s time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!---->
            <div class="n-popover-arrow-wrapper">
                <div class="n-popover-arrow"></div>
            </div>
        </div>
    </div>
  `;

    popupInsertable.appendChild(sampleMessage1Popup);

    // sample message 2

    let sampleMessage2Popup = document.createElement("span");
    sampleMessage2Popup.id = "sampleMessage2Popup";
    sampleMessage2Popup.style = "display: none; z-index: 2002;";
    sampleMessage2Popup.innerHTML = `<div
        class="v-binder-follower-content"
        v-placement="top-end"
        style="
            --v-target-width: 108px;
            --v-target-height: 20px;
            --v-offset-left: 0px;
            --v-offset-top: 0px;
            transform: translateX(970px) translateY(469px) translateX(-100%)
                translateY(-100%);
            --v-transform-origin: bottom right;
            transform-origin: right bottom;
        "
    >
        <div
            class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow"
            style="
                width: 400px;
                --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                    0 6px 16px 0 rgba(0, 0, 0, 0.08),
                    0 9px 28px 8px rgba(0, 0, 0, 0.05);
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                --n-bezier-ease-in: cubic-bezier(0.4, 0, 1, 1);
                --n-bezier-ease-out: cubic-bezier(0, 0, 0.2, 1);
                --n-font-size: 14px;
                --n-text-color: rgba(52, 64, 84, 1);
                --n-color: #fff;
                --n-divider-color: rgb(239, 239, 245);
                --n-border-radius: 3px;
                --n-arrow-height: 6px;
                --n-arrow-offset: 10px;
                --n-arrow-offset-vertical: 10px;
                --n-padding: 8px 14px;
                --n-space: 6px;
                --n-space-arrow: 10px;
            "
        >
            <div class="n-popover__header">
                <span class="font-semibold text-gray-800"
                    >Sample Message #2 Examples</span
                >
            </div>
            <div class="n-popover__content">
                <div class="flex flex-col gap-3">
                    <div
                        id="CopyTextBlock"
                        class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3"
                    >
                        <div class="text-gray-600 hl-text-sm-regular">
                            Hi Jane! This is [insert name] from Jostens. It’s time
                            to start thinking about class rings for your Student!
                            Please be watching your texts and email for more info in
                            the days to come. Text or call me anytime with questions
                            at [insert phone]. Reply STOP to unsubscribe.
                        </div>
                        <div
                            class="custom-hidden items-center justify-start group-hover:flex"
                            onclick="copyText('Hi Jane! This is [insert name] from Jostens. It’s time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at [insert phone]. Reply STOP to unsubscribe.')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!---->
            <div class="n-popover-arrow-wrapper">
                <div class="n-popover-arrow"></div>
            </div>
        </div>
    </div>
  `;

    popupInsertable.appendChild(sampleMessage2Popup);
  }

  function useCaseDescription() {
    let eud = document.getElementById("ExampleUsecaseDescription");

    let x = eud.getBoundingClientRect().x + eud.getBoundingClientRect().width;
    let y = eud.getBoundingClientRect().y + eud.getBoundingClientRect().height;
    document.getElementById(
      "useCaseDescriptionPopup",
    ).children[0].style.transform =
      "translateX(" + x + "px) translateY(" + y + "px) translateX(-100%)";
    document.getElementById("clickableBackground").style.display = "block";
    document.getElementById("useCaseDescriptionPopup").style.display = "block";
  }

  function sampleMessage1() {
    let esm = document.querySelector("#ExampleSampleMessage1");

    let x = esm.getBoundingClientRect().x + esm.getBoundingClientRect().width;
    let y = esm.getBoundingClientRect().y + esm.getBoundingClientRect().height;
    document.getElementById("sampleMessage1Popup").children[0].style.transform =
      "translateX(" + x + "px) translateY(" + y + "px) translateX(-100%)";

    document.getElementById("clickableBackground").style.display = "block";
    document.getElementById("sampleMessage1Popup").style.display = "block";
  }

  function sampleMessage2() {
    let esm = document.querySelector("#ExampleSampleMessage2");

    let x = esm.getBoundingClientRect().x + esm.getBoundingClientRect().width;
    let y = esm.getBoundingClientRect().y + esm.getBoundingClientRect().height;
    document.getElementById("sampleMessage2Popup").children[0].style.transform =
      "translateX(" + x + "px) translateY(" + y + "px) translateX(-100%)";

    document.getElementById("clickableBackground").style.display = "block";
    document.getElementById("sampleMessage2Popup").style.display = "block";
  }

  // this function copies the text parameter to the clipboard
  function copyText(text) {
    document.getElementById("clickableBackground").style.display = "none";

    document.getElementById("useCaseDescriptionPopup").style.display = "none";
    document.getElementById("sampleMessage1Popup").style.display = "none";
    document.getElementById("sampleMessage2Popup").style.display = "none";

    try {
      // these might not be created yet, so we encapsulate them in a try-block
      document.getElementById("exampleUserConsentPopup").style.display = "none";
      document.getElementById("exampleOptInPopup").style.display = "none";
      document.getElementById("clickableBackground2").style.display = "block";
    } catch (error) {}

    navigator.clipboard.writeText(text);
  }

  function nextPage() {
    // the 3 drop-down menus

    document.querySelector("#ExampleUserConsent").innerHTML =
      "<div class='flex' style='cursor: pointer' onclick='exampleUserConsent()'><span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>See example</span> <svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg></div>";

    document.querySelector("#ExampleOptInMessage").innerHTML =
      "<div class='flex' style='cursor: pointer' onclick='exampleOptInMessage()'><span style='color: rgb(29, 41, 57); font-size: 14px; text-decoration: underline; font-weight: 500'>See example</span> <svg style='margin: 4px' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' aria-hidden='true' class='h-4 w-4 text-gray-800'><path stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'></path></svg></div>";

    // Popup insertable

    let popupInsertable = document.createElement("div");
    popupInsertable.className = "v-binder-follower-container";
    popupInsertable.id = "popupInsertable";
    popupInsertable.style = "z-index: 2001";
    document.body.appendChild(popupInsertable);

    // clickable background

    let background = document.createElement("div");
    background.id = "clickableBackground2";
    background.onclick = () => {
      document.getElementById("clickableBackground2").style.display = "none";
      document.getElementById("exampleUserConsentPopup").style.display = "none";
      document.getElementById("exampleOptInPopup").style.display = "none";
    };
    background.style = `
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    z-index: 2000;
        `;
    document.body.appendChild(background);

    // Example user consent popup

    let exampleUserConsentPopup = document.createElement("span");
    exampleUserConsentPopup.id = "exampleUserConsentPopup";
    exampleUserConsentPopup.style = "display: none; z-index: 2002;";
    exampleUserConsentPopup.innerHTML = `<div
        class="v-binder-follower-content"
        v-placement="bottom-end"
        style="
            --v-target-width: 108px;
            --v-target-height: 20px;
            --v-offset-left: 0px;
            --v-offset-top: 0px;
            transform: translateX(970px) translateY(215px) translateX(-100%);
            --v-transform-origin: top right;
            transform-origin: right top;
        "
    >
        <div
            class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow"
            style="
                width: 400px;
                --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                    0 6px 16px 0 rgba(0, 0, 0, 0.08),
                    0 9px 28px 8px rgba(0, 0, 0, 0.05);
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                --n-bezier-ease-in: cubic-bezier(0.4, 0, 1, 1);
                --n-bezier-ease-out: cubic-bezier(0, 0, 0.2, 1);
                --n-font-size: 14px;
                --n-text-color: rgba(52, 64, 84, 1);
                --n-color: #fff;
                --n-divider-color: rgb(239, 239, 245);
                --n-border-radius: 3px;
                --n-arrow-height: 6px;
                --n-arrow-offset: 10px;
                --n-arrow-offset-vertical: 10px;
                --n-padding: 8px 14px;
                --n-space: 6px;
                --n-space-arrow: 10px;
            "
        >
            <div class="n-popover__header">
                <span class="font-semibold text-gray-800"
                    >User Consent Examples</span
                >
            </div>
            <div class="n-popover__content">
                <div class="flex flex-col gap-3">
                    <div
                        id="CopyTextBlock"
                        class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3"
                    >
                        <div class="text-gray-600 hl-text-sm-regular">
                            End users opt-in through a form on our
                            website&nbsp;(jostens.co/contact-form) or by personally
                            providing us with their contact details after reviewing
                            the consent language on our website. New contacts agree
                            to receive order notifications &amp; promotional
                            messages from us when providing their contact details
                            online, in-person, or otherwise. Additionally end users
                            can also text START to [insert phone].
                        </div>
                        <div
                            class="custom-hidden items-center justify-start group-hover:flex"
                            onclick="copyText('End users opt-in through a form on our website&nbsp;(jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications &amp; promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to [insert phone].')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!---->
            <div class="n-popover-arrow-wrapper">
                <div class="n-popover-arrow"></div>
            </div>
        </div>
    </div>
  `;

    popupInsertable.appendChild(exampleUserConsentPopup);

    // example opt-in message popup

    let exampleOptIn = document.createElement("span");
    exampleOptIn.id = "exampleOptInPopup";
    exampleOptIn.style = "display: none; z-index: 2002;";
    exampleOptIn.innerHTML = `<div
        class="v-binder-follower-content"
        v-placement="top-end"
        style="
            --v-target-width: 108px;
            --v-target-height: 20px;
            --v-offset-left: 0px;
            --v-offset-top: 0px;
            transform: translateX(858px) translateY(432px) translateX(-100%)
                translateY(-100%);
            --v-transform-origin: bottom right;
            transform-origin: right bottom;
        "
    >
        <div
            class="n-popover n-popover-shared n-popover--show-header-or-footer n-popover-shared--show-arrow"
            style="
                width: 400px;
                --n-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                    0 6px 16px 0 rgba(0, 0, 0, 0.08),
                    0 9px 28px 8px rgba(0, 0, 0, 0.05);
                --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
                --n-bezier-ease-in: cubic-bezier(0.4, 0, 1, 1);
                --n-bezier-ease-out: cubic-bezier(0, 0, 0.2, 1);
                --n-font-size: 14px;
                --n-text-color: rgba(52, 64, 84, 1);
                --n-color: #fff;
                --n-divider-color: rgb(239, 239, 245);
                --n-border-radius: 3px;
                --n-arrow-height: 6px;
                --n-arrow-offset: 10px;
                --n-arrow-offset-vertical: 10px;
                --n-padding: 8px 14px;
                --n-space: 6px;
                --n-space-arrow: 10px;
            "
        >
            <div class="n-popover__header">
                <span class="font-semibold text-gray-800"
                    >Opt-In Message Examples</span
                >
            </div>
            <div class="n-popover__content">
                <div class="flex flex-col gap-3">
                    <div
                        id="CopyTextBlock"
                        class="flex items-start gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 p-3"
                    >
                        <div class="text-gray-600 hl-text-sm-regular">
                            You have successfully opted-in to receive notification
                            and promotional SMS from Jostens. Please reply STOP if
                            you need to Opt-out in the future.
                        </div>
                        <div
                            class="custom-hidden items-center justify-start group-hover:flex"
                            onclick="copyText('You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.')"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 cursor-pointer text-gray-700 outline-0 hover:text-primary-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16 16v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 22 13.92 22 12.8 22H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 20.48 2 19.92 2 18.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 8 4.08 8 5.2 8H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C22 14.48 22 13.92 22 12.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C20.48 2 19.92 2 18.8 2h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C8 3.52 8 4.08 8 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C9.52 16 10.08 16 11.2 16z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!---->
            <div class="n-popover-arrow-wrapper">
                <div class="n-popover-arrow"></div>
            </div>
        </div>
    </div>
  `;

    popupInsertable.appendChild(exampleOptIn);
  }

  function exampleUserConsent() {
    let esm = document.querySelector("#ExampleUserConsent");

    let x = esm.getBoundingClientRect().x + esm.getBoundingClientRect().width;
    let y = esm.getBoundingClientRect().y + esm.getBoundingClientRect().height;

    document.getElementById(
      "exampleUserConsentPopup",
    ).children[0].style.transform =
      "translateX(" + x + "px) translateY(" + y + "px) translateX(-100%)";

    document.getElementById("clickableBackground2").style.display = "block";
    document.getElementById("exampleUserConsentPopup").style.display = "block";
  }

  function exampleOptInMessage() {
    let esm = document.querySelector("#ExampleOptInMessage");

    let x = esm.getBoundingClientRect().x + esm.getBoundingClientRect().width;
    let y = esm.getBoundingClientRect().y + esm.getBoundingClientRect().height;

    document.getElementById("exampleOptInPopup").children[0].style.transform =
      "translateX(" + x + "px) translateY(" + y + "px) translateX(-100%)";

    document.getElementById("clickableBackground2").style.display = "block";
    document.getElementById("exampleOptInPopup").style.display = "block";
  }

  console.log("cdScript running!");
}
