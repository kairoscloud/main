// Jostens Custom Code
window.addEventListener('load', function () {
  var group = document.body.classList;
  alert(group);
  if (group.contains("jostens") === true) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var id = Math.random().toString(36).slice(2, 7);
    var src = "https://kairoscloud.github.io/jostens/agency-content.js?" + id;
    script.setAttribute("id", "jostens-custom-js");
    script.src= src;
    head.appendChild(script);
  }
})
