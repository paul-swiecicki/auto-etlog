const { getWindow } = require("./getWindow");

window.addEventListener("DOMContentLoaded", () => {
  console.log(document);
  const btn = document.querySelector("button");
  console.log(btn);
  btn.addEventListener("click", (e) => {
    const window = getWindow("etlog");
    window.bringToTop();
  });
});
