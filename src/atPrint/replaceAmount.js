const robot = require("robotjs");

const replaceAmount = (amount = 1, bounds) => {
  moveMouseRelToWindow(300, 230, bounds);
  // robot.mouseClick("left", true);
  robot.keyTap("a", "control");
  robot.keyTap("backspace");
  robot.typeString(amount);
};

module.exports = { replaceAmount };
