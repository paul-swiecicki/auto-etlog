const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");

const replaceAmount = (amount = 1, bounds) => {
  console.log(amount);
  moveMouseRelToWindow(300, 230, bounds);
  robot.mouseClick();
  robot.keyTap("a", "control");
  robot.typeString(amount);
};

module.exports = { replaceAmount };
