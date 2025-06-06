// This does the following:
// - Initializes Firebase
// - Gets the locationID
// - Gets that location's token
// - Gets the GHL developer token
// - Makes all of those afforementioned things global
// This is core (!) to all of our scripts; be it session-embedded in GHL, or a standalone app like Campaigns or QR Codes. They all embed this script

try {
  const conf_public =
    "ewogICAgImFwaUtleSI6ICJBSXphU3lBa3ZsNkhLZ3VwMWFvZklyVVVfUTdiNFJsdmhJMlFUcGMiLAogICAgImF1dGhEb21haW4iOiAia2Fpcm9zLXRlc3QtZWVkZDYuZmlyZWJhcHAuY29tIiwKICAgICJwcm9qZWN0SWQiOiAia2Fpcm9zLXRlc3QtZWVkZDYiLAogICAgInN0b3JhZ2VCdWNrZXQiOiAia2Fpcm9zLXRlc3QtZWVkZDYuYXBwc3BvdC5jb20iLAogICAgIm1lc3NhbmdpbmdTZW5kZXJJZCI6ICIzNDQ0NTI0NDkzNSIsCiAgICAiYXBwSWQiOiAiMTozNDQ0NTI0NDkzNTp3ZWI6YjRlZDdlOWJlNzBjMTYyNTFkODhhMiIsCiAgICAibWVhc3VyZW1lbnRJZCI6ICJHLU0xQlhUS1NHM0IiCn0=";
  const conf_dec = JSON.parse(atob(conf_public));
  window.firebase.initializeApp(conf_dec);
  window.firestore = firebase.firestore();
} catch (error) {
  console.warn("Could not initialize Firebase: " + error.message);
}

// Get the location access token
// this cuts out another step
// all API calls will use this global variable
try {
  // capitalize to indicate global scope
  window.GlobalLocationID = getGlobalLocationID(); // URL might not contain location ID, hence the try-catch
  window.GlobalLocationAccessKey = "";
  const tokensDocRef = firestore.collection("tokens").doc(GlobalLocationID);
  tokensDocRef.get().then((doc) => {
    if (doc.exists) {
      window.GlobalLocationAccessKey = doc.data().locationAccessToken;
    }
  });
} catch (error) {
  console.warn("Could not get location access key: " + error.message);
}

function getGlobalLocationID() {
  const urlParams = new URLSearchParams(window.location.search);
  let locationSources = [
    urlParams.get("location"),
    urlParams.get("locationID"),
    window.location.href.split("/")[3],
    window.location.href.split("/")[4],
    window.location.href.split("/")[5],
  ];

  for (let i = 0; i < locationSources.length; i++) {
    // if not undefined and has a length of 20 characters
    if (locationSources[i] && locationSources[i].length == 20) {
      return locationSources[i];
    }
  }
}

// Global variable to store the timeout ID for clearing if necessary
let ghlTokenRefreshTimeoutId = null;

// figure out the token expiration date
function parseJwtPayload(token) {
  if (!token || typeof token !== "string") {
    console.error("GHL JWT: Invalid token provided for parsing.");
    return null;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error(
        "GHL JWT: Invalid JWT structure. Expected 3 parts, got",
        parts.length,
      );
      return null;
    }
    const base64Url = parts[1];
    if (!base64Url) {
      console.error("GHL JWT: Payload part is missing.");
      return null;
    }
    // Replace URL-safe characters with Base64 standard characters
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Pad with '=' if necessary
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonPayload = atob(base64); // Decodes Base64 string to a regular string
    return JSON.parse(jsonPayload); // Parses the JSON string into an object
  } catch (e) {
    console.error("GHL JWT: Error parsing JWT payload:", e);
    return null;
  }
}

/**
 * Schedules the next token refresh based on the current token's expiration.
 */
function scheduleGhlTokenRefresh() {
  // Clear any existing timeout
  if (ghlTokenRefreshTimeoutId) {
    clearTimeout(ghlTokenRefreshTimeoutId);
    ghlTokenRefreshTimeoutId = null;
  }

  if (!window.ghlToken) {
    console.warn(
      "GHL JWT: No token available to schedule refresh. Will attempt to fetch again in 1 minute.",
    );
    // Retry fetching if token is somehow lost or initial fetch failed badly
    ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, 60 * 1000);
    return;
  }

  const payload = parseJwtPayload(window.ghlToken);

  if (payload && typeof payload.exp === "number") {
    const expirationTimeMs = payload.exp * 1000; // 'exp' is in seconds, convert to ms
    const currentTimeMs = Date.now();
    const refreshBufferMs = 30 * 1000; // 30 seconds buffer

    let refreshInMs = expirationTimeMs - currentTimeMs - refreshBufferMs;

    if (refreshInMs <= 0) {
      // Token has expired or will expire within the buffer period
      console.warn(
        `GHL JWT: Token has expired or is very close to expiring (expires at ${new Date(expirationTimeMs).toLocaleTimeString()}). Refreshing immediately.`,
      );
      // Fetch immediately instead of setting a timeout for the past or very near future
      fetchAndSetGhlToken();
      return;
    }

    console.log(
      `GHL Token successfully found. Next refresh at ${new Date(expirationTimeMs).toLocaleTimeString()} (in ${(refreshInMs / 1000 / 60).toFixed(1)} minutes).`,
    );
    ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, refreshInMs);
  } else {
    console.error(
      "GHL JWT: Could not parse JWT payload or 'exp' (expiration) claim is missing/invalid. Retrying fetch in 5 minutes.",
    );
    // Fallback: if we can't determine expiration, try to refresh in 5 minutes
    ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, 5 * 60 * 1000);
  }
}

/**
 * Fetches the GHL token from Firestore, stores it in window.ghlToken,
 * and schedules the next refresh.
 */
function fetchAndSetGhlToken() {
  // Clear any existing timeout that might lead to this function being called again
  // This prevents multiple refresh loops if this function is called manually or due to an error retry
  if (ghlTokenRefreshTimeoutId) {
    clearTimeout(ghlTokenRefreshTimeoutId);
    ghlTokenRefreshTimeoutId = null;
  }

  // Path to your token in Firestore
  const tokenDocRef = firestore.collection("ghl_auth").doc("ghl_tokens");

  tokenDocRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        const data = doc.data();
        if (data && data.apiToken) {
          window.ghlToken = data.apiToken;
          // Uncomment to log a snippet of the token (for verification, be careful with logging full tokens)
          // console.log("GHL JWT (first 20 chars):", window.ghlToken.substring(0, 20) + "...");
          scheduleGhlTokenRefresh(); // Schedule the next refresh
        } else {
          window.ghlToken = null; // Ensure token is null if not found
          console.error(
            "GHL JWT: Firestore document 'ghl_tokens' exists but 'apiToken' field is missing or empty. Retrying in 1 minute.",
          );
          ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, 60 * 1000); // Retry after 1 min
        }
      } else {
        window.ghlToken = null;
        console.error(
          "GHL JWT: Firestore document 'ghl_tokens' does not exist in 'ghl_auth' collection. Retrying in 1 minute.",
        );
        ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, 60 * 1000); // Retry after 1 min
      }
    })
    .catch(function (error) {
      window.ghlToken = null;
      console.error("GHL JWT: Error fetching token from Firestore:", error);
      console.error("GHL JWT: Retrying in 1 minute.");
      ghlTokenRefreshTimeoutId = setTimeout(fetchAndSetGhlToken, 60 * 1000); // Retry after 1 min on error
    });
}

// --- Initialization ---
// Make sure Firestore is initialized before calling this.
// We'll add a check and a small delay if firestore isn't immediately available.

function initializeGhlTokenManager() {
  if (typeof firestore !== "undefined" && firestore) {
    fetchAndSetGhlToken(); // Start the process
  } else {
    console.warn(
      "GHL JWT: Firestore variable 'firestore' is not yet initialized. Waiting...",
    );
    setTimeout(initializeGhlTokenManager, 1000); // Check again in 1 second
  }
}

// Start the token management process once the DOM is ready,
// or immediately if this script is loaded defer/async after Firestore init.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGhlTokenManager);
} else {
  // DOMContentLoaded has already fired
  initializeGhlTokenManager();
}
