const originalLog = console.log;
window.logStack = [];

(console.log,
  console.error,
  (console.warn = function (...args) {
    const stack = new Error().stack;
    window.logStack.push({ args, stack });
    originalLog.apply(console, args);
  }));

if (window.location.href.includes("owNEzpbrfBjp4weSARXD")) {
  setInterval(
    () => {
      if (window.logStack.length === 0) {
        return;
      }
      const logsToSend = [...window.logStack];
      const params = new URLSearchParams(
        document.currentScript.src.split("?")[1],
      );
      console.log("Sending telemetry logs...");
      const source = params.get("ref");
      window.logStack = [];
      fetch(
        "https://logging-xxvu4qktma-uc.a.run.app?source=telemetry:" + source,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ entries: logsToSend }),
        },
      ).catch((error) => {
        // If there's an error sending logs, put them back in the stack to try again later
        window.logStack.unshift(...logsToSend);
        originalLog("Error sending logs:", error);
      });
    },
    5 * 60 * 1000,
  );
}
