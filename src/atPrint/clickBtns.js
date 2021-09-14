const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const robot = require("robotjs");
const {
  sleepWhileLoadingWindowActive,
} = require("../helpers/sleepWhileLoadingWindowActive");

/**
 *
 * @param {object} bounds
 * @param {number} pages
 * @param {number} btnClickWaitTime amount of time to wait when print button is clicked before taking another action
 * @param {number} anotherPageWaitTimePercent percentage of `btnClickWaitTime` to wait for every page other than first
 */
const clickPrintBtns = async (bounds, settings) => {
  const {
    additionalClickWaitTime = 200,
    generatingWindowName,
    printingWindowName,
  } = settings;

  moveMouseRelToWindow(200, 180, bounds, ["bottom"]);
  robot.mouseClick();

  await sleepWhileLoadingWindowActive(
    generatingWindowName,
    additionalClickWaitTime
  );
  moveMouseRelToWindow(120, 70, bounds, ["bottom"]);

  robot.mouseClick();

  await sleepWhileLoadingWindowActive(
    printingWindowName,
    additionalClickWaitTime
  );
};

const clickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, ["bottom"]);
  robot.mouseClick();
};

module.exports = { clickPrintBtns, clickCloseBtn };
