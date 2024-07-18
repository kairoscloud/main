// this script runs on all locations, regardless of if jostens or not
// Note to jake: include after firebase/firestore inclusion on agency-refresh.js, but before directory.js
// What does it do?
//  - gets a list of all locations from firebase
//  - check if loc exists in list
//  - if not, add entry to firebase and generate a new token for that location
// Additionally, it:
// - Gets the GitHub Personal Access Token from firebase, so GHA webhooks can be triggered
// - Removes some elements when embedded as an iframe

let globalLocationList = []; // This array is for pages to check if they're a Jostens subaccount. It's scoped globally so it can be accessed by other scripts
let globalGitPat = ""; // This is the GitHub Personal Access Token

// this small if-block checks if the script is running in an iframe, by looking at a tag I've added to the end of the url "#isIframe"
// if it is, we:
// - remove the support icon
// - on /analytics, remove the funnels/websites dropdown (only for Jostens reps)
// - on /analytics, remove the (i) button (also only for Jostens reps)
// We put this in a try-catch block because, in most cases, this isn't being loaded in an iframe
try {
  let iframeListenInterval = "";
  if (window.frameElement.src.includes("#isIframe")) {
    iframeListenInterval = setInterval(activeListenIframe, 1000);
  }
} catch (e) {}

if (
  window.location.href.includes("page-builder") &&
  window.location.href.includes("owNEzpbrfBjp4weSARXD") // remove after testing
) {
  // Create the new span element
  var newElement = document.createElement("span");
  newElement.style.position = "absolute";
  newElement.style.width = "110px";
  newElement.style.right = "3px";
  newElement.style.top = "6px";
  newElement.style.height = "42px";
  newElement.style.cursor = "pointer";
  newElement.id = "clickCatcher";
  newElement.setAttribute("onclick", "shortenLinkDialogue()");

  // Create the inner span element
  var innerSpan = document.createElement("span");
  innerSpan.style.backgroundColor = "#165EF0";
  innerSpan.style.position = "absolute";
  innerSpan.style.height = "30px";
  innerSpan.style.width = "60px";
  innerSpan.style.display = "flex";
  innerSpan.style.alignItems = "center";
  innerSpan.style.color = "white";
  innerSpan.style.fontWeight = "500";
  innerSpan.style.left = "40px";
  innerSpan.style.top = "5px";
  innerSpan.style.paddingLeft = "5px";
  innerSpan.id = "textCoverUp";
  innerSpan.textContent = "Link";

  // Append the inner span to the outer span

  // Create a temporary container element
  var tempContainer = document.createElement("span");
  tempContainer.innerHTML = `<div role="none" class="n-modal-body-wrapper" style="display: none;" id="linkShortenerWindow"><div role="none" class="n-scrollbar" style="--n-scrollbar-bezier: cubic-bezier(.4, 0, .2, 1); --n-scrollbar-color: rgba(0, 0, 0, 0.25); --n-scrollbar-color-hover: rgba(0, 0, 0, 0.4); --n-scrollbar-border-radius: 5px; --n-scrollbar-width: 5px; --n-scrollbar-height: 5px; display: block"><div role="none" class="n-scrollbar-container"><div role="none" class="n-scrollbar-content n-modal-scroll-content"><div aria-hidden="true" class="n-modal-mask"></div><div aria-hidden="true" tabindex="0" style="position: absolute; height: 0px; width: 0px;"></div><div class="n-card n-modal hl-modal" role="dialog" aria-modal="true" style="--n-bezier: cubic-bezier(.4, 0, .2, 1); --n-border-radius: 3px; --n-color: #fff; --n-color-modal: #fff; --n-color-popover: #fff; --n-color-embedded: rgb(250, 250, 252); --n-color-embedded-modal: rgb(250, 250, 252); --n-color-embedded-popover: rgb(250, 250, 252); --n-color-target: #155EEF; --n-text-color: rgba(52, 64, 84, 1); --n-line-height: 1.6; --n-action-color: rgb(250, 250, 252); --n-title-text-color: rgba(16, 24, 40, 1); --n-title-font-weight: 500; --n-close-icon-color: rgba(102, 102, 102, 1); --n-close-icon-color-hover: rgba(102, 102, 102, 1); --n-close-icon-color-pressed: rgba(102, 102, 102, 1); --n-close-color-hover: rgba(0, 0, 0, .09); --n-close-color-pressed: rgba(0, 0, 0, .13); --n-border-color: rgb(239, 239, 245); --n-box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04); --n-padding-top: 27px; --n-padding-bottom: 28px; --n-padding-left: 40px; --n-font-size: 14px; --n-title-font-size: 18px; --n-close-size: 22px; --n-close-icon-size: 18px; --n-close-border-radius: 3px; width: 500px; top: 15vh"><!----><div class="n-card-header"><div class="n-card-header__main" role="heading"><div class="hl-modal-heading"><div><div class="hl-icon-container"><div class="icon icon-custom"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2 12h20M2 12c0 5.523 4.477 10 10 10M2 12C2 6.477 6.477 2 12 2m10 10c0 5.523-4.477 10-10 10m10-10c0-5.523-4.477-10-10-10m0 0a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10m0-20a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10"></path></svg></div><div class="action"><button class="n-button n-button--default-type n-button--medium-type quaternary icon-only" tabindex="0" type="button" id="modal-header-modal-close-btn" linkgray="false" style="--n-bezier: cubic-bezier(.4, 0, .2, 1); --n-bezier-ease-out: cubic-bezier(0, 0, .2, 1); --n-ripple-duration: .6s; --n-opacity-disabled: 0.5; --n-wave-opacity: 0.6; font-weight: 400; --n-color: #0000; --n-color-hover: rgba(46, 51, 56, .09); --n-color-pressed: rgba(46, 51, 56, .13); --n-color-focus: rgba(46, 51, 56, .09); --n-color-disabled: #0000; --n-ripple-color: #0000; --n-text-color: rgba(52, 64, 84, 1); --n-text-color-hover: rgba(52, 64, 84, 1); --n-text-color-pressed: rgba(52, 64, 84, 1); --n-text-color-focus: rgba(52, 64, 84, 1); --n-text-color-disabled: rgba(52, 64, 84, 1); --n-border: 1px solid rgb(224, 224, 230); --n-border-hover: 1px solid #004EEB; --n-border-pressed: 1px solid #155EEF; --n-border-focus: 1px solid #004EEB; --n-border-disabled: 1px solid rgb(224, 224, 230); --n-width: 34px; --n-height: 34px; --n-font-size: 14px; --n-padding: initial; --n-icon-size: 18px; --n-icon-margin: 6px; --n-border-radius: 34px;"><!----><!----><span class="n-button__content" onclick="close()"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 7L7 17M7 7l10 10"></path></svg><!----></span><div aria-hidden="true" class="n-base-wave"></div><!----><!----></button></div></div><div class="title">Shorten link<!----></div><div class="description">Create a shortened link to your site before publishing</div></div></div></div><!----><!----></div><div class="n-card__content" role="none"><div class="hl-modal-content py-3"><div class="mb-1 hl-text-sm-medium">Title</div><style>
          .ghlText {
              font-family: "Roboto", sans-serif;
              font-weight: 400;
              font-style: normal;
              color: #2c3538;
              font-size: 12pt;
          }

      #send {
              float: right;
              color: #31324a;
              text-align: center;
              padding: 9px 11px;
              text-decoration: none;
              font-size: 14px;
              background-color: #165ef0;
              border-radius: 6px;
              margin-left: 8px;
              color: white;
              font-weight: 500;
              cusor: pointer;
          }

          #save {
              float: right;
              font-weight: 500;
              color: #31324a;
              text-align: center;
              padding: 9px 11px;
              text-decoration: none;
              font-size: 14px;
              background-color: white;
              border: 1px solid #d1d5de;
              border-radius: 6px;
              margin-left: 8px;
              color: #2c3538;
              cursor: pointer;
          }

          .greyedOut {
              background-color: #f0f0f0 !important; /* Light grey background */
              border: 1px solid #d1d5de !important;
              color: #a0a0a0 !important; /* Light grey text */
              cursor: not-allowed !important; /* Change cursor to indicate */
          }

          .input-field {
              padding: 8px 10px; /* Adjust padding to match button styles */
              font-size: 14px; /* Match font size with button styles */
              border: 1px solid #d1d5de; /* Match border style with button */
              border-radius: 5px; /* Match border radius with button styles */
              color: #2c3538; /* Match text color with button styles */
              box-sizing: border-box; /* Ensure padding is included in width */
              width: 100vw; /* Adjust width as needed */
              margin-top: 3px;
              margin-bottom: 8px;
          }
      </style>

    <input id="urlTitle" placeholder="ex. 'my page'" style="width: 95%;" class="input-field ghlText" type="text">

    <div class="mb-1 hl-text-sm-medium">Path</div>

    <div style="display: flex">
      <div type="text" class="input-field ghlText greyedOut" style="width: 25%; border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: none" id="unshortenerURLBox">jostens.co/</div><input id="urlPath" placeholder="path-to-my-page" style="width: 80%; border-top-left-radius: 0; border-bottom-left-radius: 0; margin-right: 5%" class="input-field ghlText" type="text"></div>
  <div style="display: flex; padding-top: 10px; padding-bottom: 15px">
  <input type="checkbox" style="border-radius: 3px; margin-right: 6px; margin-top: 3px"> Mask URL
  </div>
      <div class="mb-1 hl-text-sm-medium">Shortened URL</div>
  <div type="text" class="input-field ghlText greyedOut" style="width: 95%;" id="shortenedURLBox">ShortenedURL</div></div></div><div class="n-card__footer" role="none"><div class="p-2 flex items-center justify-end"><span id="save" style="display: block;" onclick="close()" class="ghlText">Skip for now</span><span id="send" class="ghlText" onclick="shortenLink()" style="cursor: pointer">Shorten</span></div></div><!----></div><div aria-hidden="true" tabindex="0" style="position: absolute; height: 0px; width: 0px;"></div></div></div><div class="n-scrollbar-rail n-scrollbar-rail--vertical n-scrollbar-rail--disabled" data-scrollbar-rail="true" aria-hidden="true"><!----></div><!----></div></div>`;
  // Get the element with id "app"
  var appElement = document.getElementById("app");

  newElement.appendChild(innerSpan);
  appElement.parentNode.insertBefore(newElement, appElement);
  appElement.parentNode.insertBefore(tempContainer.firstChild, appElement);
}

function shortenLinkDialogue() {
  document.getElementById("linkShortenerWindow").style.display = "block";
}

function close() {
  document.getElementById("linkShortenerWindow").style.display = "none";
}

function shortenLink() {
  let shortBox = document.getElementById("shortenedURLBox");
  shortBox.innerHTML = "Loading...";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "sk" + "_" + "dN" + "MGPMpU" + "hmY' + 'Edh8n",
    },
    body: JSON.stringify({
      allowDuplicates: false,
      originalURL:
        "https://app.kairoscloud.io/v2/preview/" +
        window.location.href.split("/")[6],
      path: document.getElementById("urlPath").value,
      title: document.getElementById("urlTitle").value,
      expiredURL: "https://jostens.co#expiredURL",
      cloaking: true,
      domain: "app.kairoscloud.io",
    }),
  };

  fetch("https://api.short.io/links", options)
    .then((response) => response.json())
    .then((response) => processLink(response))
    .catch((err) => console.error(err));
}

function processLink(response) {
  let shortBox = document.getElementById("shortenedURLBox");
  shortBox.innerHTML = response.shortURL;
}

function activeListenIframe() {
  let supportButton = document.getElementById("sw-exp-button-cont");
  if (supportButton) {
    supportButton.style.display = "none";
    clearInterval(iframeListenInterval); // because this element is the last loaded of the 3 we want to hide, we can stop listening afterwards
  }

  let analyticsSelectCategory = document.getElementById(
    "analytics-select-category",
  );
  if (analyticsSelectCategory) {
    analyticsSelectCategory.style.display = "none";
  }

  let funnelWebsiteAnalytics = document.querySelector(
    "#funnelWebsiteAnalytics > div > div > div > div.flex.items-center.justify-between > div:nth-child(2) > a",
  );
  if (funnelWebsiteAnalytics) {
    funnelWebsiteAnalytics.style.display = "none";
  }
}

// this code block is for the adding a new location to FB
setTimeout(() => {
  // do everything after waiting 4 seconds
  let firebaseConfig = {
    apiKey: "AIzaSyAkvl6HKgup1AofIrUU_Q7b4RlvhI2QTpc",
    authDomain: "kairos-test-eedd6.firebaseapp.com",
    projectId: "kairos-test-eedd6",
    storageBucket: "kairos-test-eedd6.appspot.com",
    messagingSenderId: "34445244935",
    appId: "1:34445244935:web:b4ed7e9be70c16251d88a2",
    measurementId: "G-M1BXTKSG3B",
  };

  firebase.initializeApp(firebaseConfig, "primary");
  console.log("Initializing newloc!");
  checkIfLocationInFB();

  function checkIfLocationInFB() {
    // we encapsulate it in a function, so it doesn't interfere with firebase stuff in any other files

    let firestore = firebase.app("primary").firestore();
    let locationNL = window.location.href.split("/")[5];
    // let locationNL = "vPGRw179FP3xMUXHoDWF"; // for testing
    let agencyTokenNL = "";
    let inDB = false;

    // grab the github personal access token
    firestore
      .collection("github_pat")
      .doc("pat")
      .get()
      .then((doc) => {
        globalGitPat = doc.data().pat;
        console.log("GGP: " + globalGitPat);
      });

    firestore // check if location is in firebase
      .collection("tokens")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id == locationNL) {
            inDB = true;
          }
          if (doc.id == "agency") {
            agencyTokenNL = doc.data().agencyAccessToken;
          }
        });
      })
      .then(() => {
        if (inDB == false) {
          // if not in firebase
          getLocationAccessToken(agencyTokenNL, locationNL).then(
            // get a new one for the location
            (result) => {
              firestore.collection("tokens").doc(locationNL).set({
                // and store it in a new entry
                locationAccessToken: result,
                isJostens: "false",
              });
            },
          );
        }
      })
      .then(() => {
        // update global locations array. This array is for pages to check if they're a Jostens subaccount
        FBToArray();
      });

    async function getLocationAccessToken(accessTokenX, locationX) {
      const url = "https://services.leadconnectorhq.com/oauth/locationToken";
      const options = {
        method: "POST",
        headers: {
          Version: "2021-07-28",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: "Bearer " + accessTokenX,
        },
        body: new URLSearchParams({
          companyId: "eRzyNWgO7fUGsvSQv7eR", // Kairos Cloud agency
          locationId: locationX,
        }),
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        //console.log(data);
        return data.access_token;
      } catch (error) {
        console.error(error);
      }
    }
  }

  // puts the firebase contents into a global array
  function FBToArray() {
    firebase.initializeApp(firebaseConfig, "secondary"); // we name it something different to avoid conflict with the other firebase instance. It also forces an update.
    setTimeout(() => {
      // allow a 2s delay for firebase to update with the new entry
      firebase
        .app("secondary")
        .firestore()
        .collection("tokens")
        .get()
        .then((querySnapshot) => {
          const array = [];
          querySnapshot.forEach((doc) => {
            if (doc.id != "agency") {
              // for all docs (except agency), add to array
              array.push({
                id: doc.id,
                isJostens: doc.data().isJostens,
              });
            }
          });
          return array;
        })
        .then((array) => {
          globalLocationList = array;
          console.log(globalLocationList);
        });
    }, 2000);
  }
}, 4000);
