// userID.js
// We use this to fingerprint the user and create an ID that is:
//  a) Unique. Uses as many data points as possible
//  b) Static. Cannot be easily changed by the user
// All data is funneled into a hash function (see hash.js) to create a unique ID
// We use this ID to track users on preview pages, and display this data to reps
// Src'd from https://kairoscloud.github.io/main/userID.js
// Runs on https://sites.kairoscloud.io/*
// Jacob Westra, jacob@thekairosmedia.com

let globalUserID = hash(
  (
    navigator.userAgent +
    navigator.platform +
    navigator.vendor +
    navigator.language +
    navigator.languages +
    navigator.appName +
    navigator.appVersion +
    navigator.appCodeName +
    navigator.cookieEnabled +
    navigator.doNotTrack +
    navigator.onLine +
    navigator.hardwareConcurrency +
    navigator.product +
    screen.colorDepth +
    screen.pixelDepth
  )
    .toString()
    .replaceAll(" ", ""),
);

// // Attempt WebGL fingerprinting

// function getWebGLFingerprint() {
//   try {
//     const canvas = document.createElement("canvas");
//     const gl =
//       canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
//     if (gl) {
//       const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
//       if (debugInfo) {
//         let webglVendor =
//           gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
//         let webglRenderer =
//           gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";

//         return webglVendor + webglRenderer;
//       }
//     }
//   } catch (e) {
//     return "";
//   }
// }

// // Attempt Canvas fingerprinting

// function getCanvasFingerprint() {
//   try {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     ctx.textBaseline = "top";
//     ctx.font = "14px 'Arial'";
//     ctx.fillText("Hello, fingerprint!", 2, 2);
//     return hash(canvas.toDataURL());
//   } catch (e) {
//     return "";
//   }
// }

console.log("User ID: " + globalUserID);
