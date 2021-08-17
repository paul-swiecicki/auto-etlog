const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { fillSerial } = require("./fillSerial");

const fillTextInputs = ({
  ssccAmount = 1,
  additionalText = "A 01",
  amount = 1,
  isDateInput = false,
  bounds,
}) => {
  moveMouseRelToWindow(220, 100, bounds);
  robot.mouseClick();
  robot.keyTap("backspace");
  robot.keyTap("a", "control");
  robot.typeString(ssccAmount);
  robot.keyTap("tab");
  robot.keyTap("tab");
  if (isDateInput) {
    robot.keyTap("a", "control");
    robot.typeString(additionalText);
    // fillSerial();
    robot.keyTap("tab");
    // atPrintFillDate();
  } else {
    robot.keyTap("a", "control");
    robot.typeString(additionalText);
  }
  robot.keyTap("tab");
  robot.keyTap("a", "control");
  robot.typeString(amount);
};

module.exports = { fillTextInputs };
