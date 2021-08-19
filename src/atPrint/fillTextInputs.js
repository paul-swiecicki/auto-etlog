const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { fillSerial } = require("./fillSerial");

const defaultSsccAmount = 2;
const defaultPages = 1;

const fillTextInputs = ({
  ssccAmount = 1,
  pages = 1,
  additionalText = "A 01",
  amount = 1,
  isDateInput = false,
  bounds,
}) => {
  moveMouseRelToWindow(220, 100, bounds);
  robot.mouseClick();
  if (ssccAmount != defaultSsccAmount) {
    robot.keyTap("backspace");
    robot.typeString(ssccAmount);
  }
  robot.keyTap("tab");
  if (pages != defaultPages) {
    robot.keyTap("a", "control");
    robot.typeString(pages);
  }
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
