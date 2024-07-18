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

// if (window.location.href.includes("page-builder")) {
//   document.body.innerHTML += `<span style="position: absolute; width: 110px; right: 3px; top: 6px; height: 42px; cursor: pointer" id="clickCatcher" onclick="alert('Hello!')"><span style="background-color: #165EF0; position: absolute; height: 30px; width: 60px; display: flex; align-items: center; color: white; font-weight: 500; left: 40px; top: 5px; padding-left: 5px" id="textCoverUp">  Link</span></span>`;
// }

function shortenLinkDialogue() {}

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
