console.log("Test Code Loaded!");
Console.log("Script ver 2");

loaded["test"] = true;
let test_code_var = true;
let throwError = false;
setInterval(() => {
  console.log("Test script running!");
  active["test"] = Date.now();
  if(throwError){
    throw new Error;
  }
}, 2000);
