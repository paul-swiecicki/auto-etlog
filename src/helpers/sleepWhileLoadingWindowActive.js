const { getWindow } = require("../utils/getWindow");
const { sleep } = require("../utils/sleep");

const additionalStartWaitTime = 100;
const additionalEndWaitTime = 100;
const sleepWhileLoadingWindowActive = (loadingWindowRegEx) =>
  new Promise(async (resolve, reject) => {
    await sleep(additionalStartWaitTime);

    let canStopSleep = false;
    const interval = setInterval(async () => {
      const printingWindow = getWindow(loadingWindowRegEx);

      if (canStopSleep && !printingWindow) {
        clearInterval(interval);
        await sleep(additionalEndWaitTime);
        resolve();
      } else {
        canStopSleep = true;
      }
    }, 100);
  });

module.exports = { sleepWhileLoadingWindowActive };
