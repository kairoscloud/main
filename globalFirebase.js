// This puts a single firebase object in the global scope
// Why? Instead of creating a firebase object whenever we need it (ex. to grab an API key), we just create it once and reuse it
// Having multiple firebase objects in the global scope has lead to many issues
// Plus, we need firebase globally anyways to push all the telemetry data

try {
  const firebaseConfig = {
    apiKey: "AIzaSyAkvl6HKgup1AofIrUU_Q7b4RlvhI2QTpc",
    authDomain: "kairos-test-eedd6.firebaseapp.com",
    projectId: "kairos-test-eedd6",
    storageBucket: "kairos-test-eedd6.appspot.com",
    messagingSenderId: "34445244935",
    appId: "1:34445244935:web:b4ed7e9be70c16251d88a2",
    measurementId: "G-M1BXTKSG3B",
  };
  window.firebase.initializeApp(firebaseConfig);
  window.firestore = firebase.firestore();
} catch (error) {
  console.warn("Could not initialize Firebase: " + error.message);
}

// Get the location access token
// this cuts out another step
// all API calls will use this global variable
try {
  // capitalize to indicate global scope
  window.GlobalLocationID = window.location.href.split("/")[5]; // URL might not contain location ID, hence the try-catch
  window.GlobalLocationAccessKey = "";
  const tokensDocRef = firestore.collection("tokens").doc(GlobalLocationID);
  tokensDocRef.get().then((doc) => {
    if (doc.exists) {
      GlobalLocationAccessKey = doc.data().locationAccessToken;
    } else {
      throw new Error("No location found");
    }
  });
} catch (error) {
  console.warn("Could not get location access key: " + error.message);
}
