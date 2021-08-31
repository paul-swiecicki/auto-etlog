const { sleep } = require("../utils/sleep");
const { escDetector } = require("./escDetector");
const { getAndStoreElementsValues } = require("./getAndStoreElementsValues");
const { hideResultBox, showResultBox } = require("./manageResultBox");

const atProducts = require("../atProducts");
const atPrint = require("../atPrint");
const { getWindow } = require("../utils/getWindow");

const getAndPrepareEtlogWindow = () => {
  const window = getWindow("^etlog");
  if (!window) return null;

  window.bringToTop();

  return window;
};

const getInnerWindow = (fullTitle, innerWindow) => {
  const regExObj = new RegExp(`etlog \\(.+\\) - \\[${innerWindow}`, "i");
  const matchResult = fullTitle.match(regExObj);
  return matchResult;
};

const initAndValidate = async (elements) => {
  hideResultBox();

  const elemsValues = getAndStoreElementsValues(elements);
  const etlogWindow = getAndPrepareEtlogWindow();
  const bounds = etlogWindow.getBounds();

  await sleep(150);
  if (!etlogWindow)
    return showResultBox({
      msg: "Nie znaleziono EtLoga",
      desc: "Upewnij się, że EtLog jest otwarty.",
      type: "error",
    });

  let isPrintWindow = false;
  const windowTitle = etlogWindow.getTitle();
  if (getInnerWindow(windowTitle, "wydruk etykiety")) {
    isPrintWindow = true;
  } else if (!getInnerWindow(windowTitle, "produkty")) {
    return showResultBox({
      msg: "EtLog nie jest poprawnie przygotowany",
      desc: 'Otwórz okno "Produkty" w EtLogu i zmaksymalizuj je',
      type: "error",
    });
  }

  // if (!isPrintWindow) {
  //   try {

  //   } catch (err) {
  //     if (err.message === atProducts.windowTooSmallError)
  //       return showResultBox({
  //         msg: 'Okno EtLog jest zbyt małe lub schowane, nie jest możliwe kliknięcie przycisku "drukuj".',
  //         desc: "Powiększ okno i spróbuj ponownie.",
  //         type: "error",
  //       });
  //   }
  // }
  return {
    bounds,
    etlogWindow,
    elemsValues,
    isPrintWindow,
  };
};

module.exports = {
  initAndValidate,
};