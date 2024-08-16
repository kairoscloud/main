console.log("Test Code Loaded!");

loaded["test"] = true;
let test_code_var = true;
let throw = false;
setInterval(() => {
  console.log("Test script running!");
  active["test"] = Date.now();
  if(throw){
    throw new Error;
  }
}, 2000);
