const robot = require("robotjs");

const clickPrintBtns = async (bounds, btnClickWaitTime = 2300) => {
  moveMouseRelToWindow(200, 180, bounds, true);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
  moveMouseRelToWindow(120, 70, bounds, true);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
};

const clickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, true);
  robot.mouseClick();
};

module.exports = { clickPrintBtns, clickCloseBtn };
