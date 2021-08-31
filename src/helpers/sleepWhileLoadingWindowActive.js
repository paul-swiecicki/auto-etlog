const { getWindow } = require("../utils/getWindow");
const { sleep } = require("../utils/sleep");
const { showResultBox } = require("./manageResultBox");
// const { showResultBox } = require("./helpers/manageResultBox");

const windowCheckRate = 100;
const maxWaitForWindow = 5000;

const additionalStartWaitTime = 100;
const additionalEndWaitTime = 100;
const sleepWhileLoadingWindowActive = (loadingWindowRegEx) =>
  new Promise(async (resolve, reject) => {
    await sleep(additionalStartWaitTime);

    let canStopSleep = false,
      cantFindWindowTimeout;
    const interval = setInterval(async () => {
      const printingWindow = getWindow(loadingWindowRegEx);

      if (printingWindow) {
        canStopSleep = true;
      } else if (canStopSleep) {
        // } else {
        clearInterval(interval);
        clearTimeout(cantFindWindowTimeout);

        await sleep(additionalEndWaitTime);
        resolve();
      }
    }, windowCheckRate);

    cantFindWindowTimeout = setTimeout(() => {
      clearInterval(interval);

      showResultBox({
        msg: "Nie znaleziono okna drukowania",
        desc: "Prawdopodobnie to problem z EtLogiem",
        type: "error",
      });
      reject("Cant find loading window");
    }, maxWaitForWindow);
  });

module.exports = { sleepWhileLoadingWindowActive };
