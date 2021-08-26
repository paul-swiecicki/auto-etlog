const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");

const replaceAmount = (amount = 1, pages = 1, bounds, isDateInput = false) => {
  moveMouseRelToWindow(230, 130, bounds);
  robot.mouseClick();
  robot.keyTap("a", "control");
  robot.typeString(pages);
  robot.keyTap("tab");
  robot.keyTap("tab");

  if (isDateInput) robot.keyTap("tab");

  robot.keyTap("a", "control");
  robot.typeString(amount);
};

module.exports = { replaceAmount };
