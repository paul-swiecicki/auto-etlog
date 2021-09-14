const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const robot = require("robotjs");
const {
  sleepWhileLoadingWindowActive,
} = require("../helpers/sleepWhileLoadingWindowActive");

// const clickPrintWhenActive = (bounds) =>
//   new Promise(async (resolve, reject) => {
//     await sleep(100);
//     console.log(bounds);

//     // moveMouseRelToWindow(120, 70, bounds, ["bottom"]);
//     const cords = getWindowRelativeCords(120, 70, bounds, ["bottom"]);
//     // moveMouseRelToWindow(120, 70, bounds, ["bottom"]);
//     const colorCheckInterval = setInterval(async () => {
//       const pixelColor = robot.getPixelColor(...cords);
//       logColor(pixelColor);
//       if (pixelColor === "fefefe") {
//         clearInterval(colorCheckInterval);
//         await sleep(100);
//         moveMouseRelToWindow(120, 70, bounds, ["bottom"]);
//         resolve();
//       }
//     }, 100);
//   });

/**
 *
 * @param {object} bounds
 * @param {number} pages
 * @param {number} btnClickWaitTime amount of time to wait when print button is clicked before taking another action
 * @param {number} anotherPageWaitTimePercent percentage of `btnClickWaitTime` to wait for every page other than first
 */
const clickPrintBtns = async (bounds, additionalClickWaitTime = 200) => {
  moveMouseRelToWindow(200, 180, bounds, ["bottom"]);
  robot.mouseClick();

  await sleepWhileLoadingWindowActive(
    "^generowanie podglądów",
    additionalClickWaitTime
  );
  moveMouseRelToWindow(120, 70, bounds, ["bottom"]);

  robot.mouseClick();

  await sleepWhileLoadingWindowActive("^drukowanie", additionalClickWaitTime);
};

const clickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, ["bottom"]);
  robot.mouseClick();
};

module.exports = { clickPrintBtns, clickCloseBtn };
