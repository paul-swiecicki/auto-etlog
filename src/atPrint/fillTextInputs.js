const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../moveMouseRelToWindow");
const { fillSerial } = require("./fillSerial");

const fillTextInputs = ({
  ssccAmount = 1,
  additionalText = "A 01",
  amount = 1,
  isBiedronka = false,
  bounds,
}) => {
  moveMouseRelToWindow(220, 100, bounds);
  robot.mouseClick();
  robot.keyTap("backspace");
  robot.typeString(ssccAmount);
  robot.keyTap("tab");
  robot.keyTap("tab");
  if (isBiedronka) {
    // robot.keyTap("a", "control");
    fillSerial();
    robot.keyTap("tab");
    // atPrintFillDate();
  } else {
    robot.keyTap("a", "control");
    robot.typeString(additionalText);
  }
  robot.keyTap("tab");
  robot.keyTap("delete");
  robot.typeString(amount);
};

module.exports = { fillTextInputs };
