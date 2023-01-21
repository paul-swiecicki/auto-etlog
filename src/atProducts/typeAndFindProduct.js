const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const robot = require("robotjs");

const typeAndFindProduct = (gtin, bounds) => {
  moveMouseRelToWindow(60, 110, bounds, ["right"]);
  robot.mouseClick();

  robot.keyTap("a", "control");
  robot.typeString(gtin);
};

module.exports = {
  typeAndFindProduct,
};
