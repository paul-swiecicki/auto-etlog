const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { sleep } = require("../utils/sleep");
const robot = require("robotjs");

const clickPrintBtns = async (bounds, btnClickWaitTime = 2300) => {
  moveMouseRelToWindow(200, 180, bounds, ["bottom"]);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
  moveMouseRelToWindow(120, 70, bounds, ["bottom"]);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
};

const clickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, ["bottom"]);
  robot.mouseClick();
};

module.exports = { clickPrintBtns, clickCloseBtn };
