console.log("Test Code Loaded!");
console.log("Script ver 2");

loaded["test"] = true;
let test_code_var = true;
let throwError = false;
let tempIntv = setInterval(() => {
  console.log("Test script running!");
  active["test"] = Date.now();
  if (throwError) {
    throw new Error();
  }
}, 2000);

setTimeout(clearInterval(tempIntv), 10000); // clear after 10s
