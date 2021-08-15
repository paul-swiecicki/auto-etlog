const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const robot = require("robotjs");
const { sleep } = require("../utils/sleep");

const windowTooSmallError = "window_too_small";

const clickPrintBtn = async (bounds, loadTime) => {
  /**
   * Minimal window width for a print button to move relative to left window edge
   */
  const minWidthToMove = 970;
  let relToRight = true;
  if (bounds.width < 580) throw new Error(windowTooSmallError);
  if (bounds.width < minWidthToMove) relToRight = false;
  moveMouseRelToWindow(relToRight ? 390 : 570, 380, bounds, [
    relToRight ? "right" : "left",
    "bottom",
  ]);
  robot.mouseClick();
  await sleep(loadTime);
};

module.exports = { clickPrintBtn, windowTooSmallError };
