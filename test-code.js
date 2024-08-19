// this is a test script. Should be pretty self-explanatory

console.log("script version 4!");
main_test();

function main_test() {
  let tempIntv = setInterval(() => {
    //console.log("Test script running!");
    active["test"] = Date.now();
    if (stop["test"]) {
      clearInterval(tempIntv);
      console.log("Test script stopped!");
    }
  }, 2000);
}
