console.log("Test Code Loaded!");
console.log("Script ver 3");

loaded["test"] = true;
let test_code_var = true;

//setTimeout(clearInterval(tempIntv), 10000); // clear after 10s
let tempIntv = setInterval(() => {
  console.log("Test script running!");
  active["test"] = Date.now();
}, 2000);
