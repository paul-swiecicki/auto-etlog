const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const robot = require("robotjs");
const { sleep } = require("../utils/sleep");
const atProducts = require("../atProducts");

const windowTooSmallError = "window_too_small";

const clickPrintBtn = async (bounds, loadTime) => {
  /**
   * Minimal window width for a print button to move relative to left window edge
   */
  const minWidthToMove = 970;
  let relToRight = true;

  try {
    if (bounds.width < 580) throw new Error(windowTooSmallError);
    if (bounds.width < minWidthToMove) relToRight = false;
    moveMouseRelToWindow(relToRight ? 390 : 570, 350, bounds, [
      relToRight ? "right" : "left",
      "bottom",
    ]);
    robot.mouseClick();
    await sleep(loadTime);
  } catch (err) {
    if (err.message === atProducts.windowTooSmallError)
      return showResultBox({
        msg: 'Okno EtLog jest zbyt małe lub schowane, nie jest możliwe kliknięcie przycisku "drukuj".',
        desc: "Powiększ okno i spróbuj ponownie.",
        type: "error",
      });
    else throw err;
  }
};

module.exports = { clickPrintBtn, windowTooSmallError };
