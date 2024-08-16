console.log("Test Code Loaded!");

loaded["test"] = true;
test_code_var = true;
setInterval(() => {
  console.log("Test script running!");
  active["test"] = Date.now();
}, 2000);
