// This overrides the console.log function to push all console.logs to a global variable, logStack – which will later get pushed to Firebase.
// - It does the same with console.error, console.warn, and error throwing
// - If an object gets logged to the console, it'll be stringified in the logStack
// - All logStack entries include exact timestamps, in (00:00 AM/PM) EST format, the call stack (in [function(), callerScript:line:col] format), and the message

// Store the original console.log function
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Create a global variable to store logs
window.logStack = [];

// Helper function to get formatted time in EST
function getFormattedTime() {
  const options = {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date().toLocaleTimeString("en-US", options);
}

// Helper function to stringify objects
function stringifyObject(obj) {
  if (typeof obj === "object" && obj !== null) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  }
  return String(obj);
}

// Data structure to keep track of duplicate counts
const duplicateCounts = new Map();

// Override console.log
console.log = function () {
  // Get call stack
  const error = new Error("ignore-ForStackOnly");
  const stack = error.stack.split("\n");
  let callingFunction = "global";
  let callingScript = "unknown";

  if (stack.length > 2) {
    const callerLine = stack[2].trim();
    const functionMatch = callerLine.match(/at (.+?) \(/);
    const scriptMatch = callerLine.match(/\((.+?)\)/);

    if (functionMatch) callingFunction = functionMatch[1];
    if (scriptMatch) callingScript = scriptMatch[1].split("/").pop();
  }

  // Call original console.log with script info
  const args = Array.from(arguments);

  // this isn't the spot in the code you're looking for. Console.log() is overridden here, but the original stack trace is preserved in the beginning [] of the message. Please use that!
  originalConsoleLog.apply(console, [
    `%c${callingScript}`,
    "color: #1460AD;",
    ...args,
  ]);

  // Format message for logStack
  const message = args.map((arg) => stringifyObject(arg)).join(" ");
  const time = getFormattedTime();
  const baseLogEntry = `[${time}][${callingFunction}, ${callingScript}]: ${message}`;

  // Check for duplicates using the base entry as key
  if (duplicateCounts.has(baseLogEntry)) {
    // Increment count for duplicate
    const count = duplicateCounts.get(baseLogEntry) + 1;
    duplicateCounts.set(baseLogEntry, count);

    // Find and update the existing entry in logStack
    const index = window.logStack.findIndex((log) =>
      log.startsWith(baseLogEntry),
    );
    if (index !== -1) {
      window.logStack[index] = `${baseLogEntry} (${count})`;
    }
  } else {
    // New unique log
    duplicateCounts.set(baseLogEntry, 1);
    window.logStack.push(baseLogEntry);
  }
};

// Override console.error
console.error = function (...args) {
  // Capture the stack trace. We need to do this outside of the try-catch block to avoid the error being caught
  const stack = new Error("ignore-ForStackOnly").stack;
  try {
    // Extract the relevant part of the stack trace (e.g., function, script, line, column)
    const stackTrace = stack.split("\n")[2].trim(); // Skip the first two lines (current and the error line)

    // Format the message: [ERROR][CallingFunction, callingScript:line:column]: Message
    const formattedMessage = `[${getFormattedTime()}][ERROR][${stackTrace}]: ${args.join(" ")} [End error]`; // Format the text

    // Add the stack trace to the original console.error call
    const updatedArgs = [...args, stackTrace];

    // Call original console.error with updated arguments
    originalConsoleError.apply(console, updatedArgs);
    window.logStack.push(formattedMessage);
  } catch {
    // if an error occurs while logging an error, this will cause an infinite loop of recursion, so we catch it here and do nothing
  }
};

// override console.warn
console.warn = function (...args) {
  // Capture the stack trace
  const stack = new Error("ignore-ForStackOnly").stack;
  // Extract the relevant part of the stack trace (e.g., function, script, line, column)
  const stackTrace = stack.split("\n")[2].trim(); // Skip the first two lines (current and the error line)
  // Format the message: [ERROR][CallingFunction, callingScript:line:column]: Message
  const formattedMessage = `[${getFormattedTime()}][WARNING][${stackTrace}]: ${args.join(" ")} [End warning]`; // Format the text
  // Add the stack trace to the original console.error call
  const updatedArgs = [...args, stackTrace];
  // Call original console.error with updated arguments
  originalConsoleWarn.apply(console, updatedArgs);
  window.logStack.push(formattedMessage);
};

// since javascript doesn't allow us to override 'throw new Error()', we use this instead. This triggers each time an error is thrown
window.onerror = function (message, source, lineno, colno, error) {
  try {
    if (lineno == 0 && colno == 0 && error == null) {
      window.logStack.push(`[${getFormattedTime()}][ERROR]: ${message}`);
    } else {
      window.logStack.push(
        `[${getFormattedTime()}][ERROR][${source + ":" + lineno + ":" + colno}]: ${message} [End error]`,
      );
    }
  } catch {
    // can't afford the possibility of errors occurring in the error handler, so we catch them here and do nothing
  }
};

// console.log("Log!");
// console.error("Error!");
// console.warn("Warning!");
// throw new Error("Thrown Error!");
