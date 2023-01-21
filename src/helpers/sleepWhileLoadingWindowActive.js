const { getWindow } = require("../utils/getWindow");
const { sleep } = require("../utils/sleep");
const { showResultBox } = require("./manageResultBox");

const windowCheckRate = 100;
const maxWaitForWindow = 5000;

const sleepWhileLoadingWindowActive = (
  loadingWindowRegEx,
  additionalClickWaitTime
) =>
  new Promise(async (resolve, reject) => {
    let canStopSleep = false,
      cantFindWindowTimeout;
    await sleep(additionalClickWaitTime);
    const printingWindow = getWindow(loadingWindowRegEx);
    if (printingWindow) {
      canStopSleep = true;
    }

    const interval = setInterval(async () => {
      const printingWindow = getWindow(loadingWindowRegEx);

      if (printingWindow) {
        canStopSleep = true;
        clearTimeout(cantFindWindowTimeout);
      } else if (canStopSleep) {
        clearInterval(interval);
        clearTimeout(cantFindWindowTimeout);

        await sleep(additionalClickWaitTime);
        resolve();
      }
    }, windowCheckRate);

    cantFindWindowTimeout = setTimeout(() => {
      clearInterval(interval);

      showResultBox({
        msg: "Nie znaleziono okna generowania/drukowania",
        desc: "Prawdopodobnie to problem z EtLogiem",
        type: "error",
      });
      reject("Cant find loading window");
    }, maxWaitForWindow);
  });

module.exports = { sleepWhileLoadingWindowActive };
