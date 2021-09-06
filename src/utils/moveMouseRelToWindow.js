const robot = require("robotjs");
const { getWindowRelativeCords } = require("./getWindowRelativeCords");

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {object} bounds window bounds
 * @param {["top" | "left" | "bottom" | "right" ]} relTo default `["top", "left"]`
 */
const moveMouseRelToWindow = (x, y, bounds, relTo = ["top", "left"]) => {
  const [winX, winY] = getWindowRelativeCords(x, y, bounds, relTo);
  robot.moveMouse(winX, winY);
};

module.exports = {
  moveMouseRelToWindow,
};
