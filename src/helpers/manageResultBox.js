const { getElementsById } = require("../utils/getElementsById");

let resultElements;

document.addEventListener("DOMContentLoaded", () => {
  resultElements = getElementsById([
    "resultMsg",
    "resultContainer",
    "resultDesc",
  ]);
});

/**
 *
 * @param {string} text
 * @param {desc} text
 * @param {"success" | "warning" | "error"} type
 */
const showResultBox = ({
  msg,
  desc = "",
  type = "success",
  isHtml = false,
}) => {
  resultElements.resultContainer.className = `resultContainer ${type}`;
  resultElements.resultMsg.innerText = msg;
  resultElements.resultDesc[isHtml ? "innerHTML" : "innerText"] = desc;
};
const hideResultBox = () => {
  const resultContainer = resultElements.resultContainer;
  if (resultContainer) resultContainer.classList.add("unactive");
};

module.exports = {
  showResultBox,
  hideResultBox,
};
