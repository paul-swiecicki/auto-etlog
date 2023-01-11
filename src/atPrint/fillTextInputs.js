const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { fillDate } = require("./fillDate");

const defaultSsccAmount = 2;
const defaultPages = 1;

const fillTextInputs = ({ elemsValues, pages = 1, amount = 1, bounds }) => {
  const { inputs, boxes } = elemsValues;
  const { ssccAmount, additionalText } = inputs;
  const { isDateInput } = boxes;

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
  robot.keyTap("a", "control");
  robot.typeString(additionalText);
  if (isDateInput) {
    robot.keyTap("tab");
    fillDate(elemsValues.inputs.packDate);
  }
  robot.keyTap("tab");
  robot.keyTap("a", "control");
  robot.typeString(amount);
};

module.exports = { fillTextInputs };
