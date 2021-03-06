const robot = require("robotjs");
const {
  bottomEdgeY,
  rightEdgeX,
  leftEdgeX,
  topEdgeY,
} = require("./getRelativeCords");

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {object} bounds window bounds
 * @param {["top" | "left" | "bottom" | "right" ]} relTo default `["top", "left"]`
 * @returns [x, y] relative to window bounds
 */
const getWindowRelativeCords = (
  x = 0,
  y = 0,
  bounds = { x: 0, y: 0, width: 500, height: 500 },
  relTo = ["top", "left"]
) => {
  if (!bounds) throw new Error("window bounds not passed");
  let winX = leftEdgeX(x, bounds);
  let winY = topEdgeY(y, bounds);

  if (relTo.includes("bottom")) {
    winY = bottomEdgeY(y, bounds);
  }
  if (relTo.includes("right")) {
    winX = rightEdgeX(x, bounds);
  }
  return [winX, winY];
};

module.exports = {
  getWindowRelativeCords,
};
