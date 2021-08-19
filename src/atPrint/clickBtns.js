const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { sleep } = require("../utils/sleep");
const robot = require("robotjs");

/**
 *
 * @param {object} bounds
 * @param {number} pages
 * @param {number} btnClickWaitTime amount of time to wait when print button is clicked before taking another action
 * @param {number} anotherPageWaitTimePercent percentage of `btnClickWaitTime` to wait for every page other than first
 */
const clickPrintBtns = async (
  bounds,
  pages,
  btnClickWaitTime = 2300,
  anotherPageWaitTimePercentage = 60
) => {
  const parsedBtnClickWaitTime = parseFloat(btnClickWaitTime);
  moveMouseRelToWindow(200, 180, bounds, ["bottom"]);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
  moveMouseRelToWindow(120, 70, bounds, ["bottom"]);
  robot.mouseClick();
  const pageWaitTime =
    (anotherPageWaitTimePercentage / 100) *
    parsedBtnClickWaitTime *
    (pages - 1);
  // console.log({
  //   anotherPageWaitTimePercentage,
  //   pageWaitTime,
  //   parsedBtnClickWaitTime,
  //   add: parsedBtnClickWaitTime + pageWaitTime,
  // });
  await sleep(parsedBtnClickWaitTime + pageWaitTime);
};

const clickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, ["bottom"]);
  robot.mouseClick();
};

module.exports = { clickPrintBtns, clickCloseBtn };
