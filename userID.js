// userID.js
// We use this to fingerprint the user and create an ID that is:
//  a) Unique. Uses as many data points as possible
//  b) Static. Cannot be easily changed by the user
// All data is funneled into a hash function (see hash.js) to create a unique ID
// We use this ID to track users on preview pages, and display this data to reps
// Src'd from https://kairoscloud.github.io/main/userID.js
// Runs on https://sites.kairoscloud.io/*
// Jacob Westra, jacob@thekairosmedia.com

function getUserID() {
  const data = {
    userAgent: navigator.userAgent || "",
    platform: navigator.platform || "",
    language: navigator.language || "",
    languages: navigator.languages ? navigator.languages.join(",") : "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    deviceMemory: navigator.deviceMemory || "",
    cpuCores: navigator.hardwareConcurrency || "",
    touchSupport: navigator.maxTouchPoints || "",
    colorDepth: screen.colorDepth || "",
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "1"
      : "0",
  };

  // Attempt WebGL fingerprinting
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        data.webglVendor =
          gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
        data.webglRenderer =
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }
    }
  } catch (e) {
    data.webglVendor = data.webglRenderer = "";
  }

  // Attempt Canvas fingerprinting
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillText("Hello, fingerprint!", 2, 2);
    data.canvasHash = hash(canvas.toDataURL());
  } catch (e) {
    data.canvasHash = "";
  }

  // Hash all collected data
  return hash(Object.values(data).join("|"));
}

let globalUserID = getUserID();
console.log(globalUserID);
