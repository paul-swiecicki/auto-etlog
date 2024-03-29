const { sleep } = require("../utils/sleep");
const { getAndStoreElementsValues } = require("./getAndStoreElementsValues");
const { hideResultBox, showResultBox } = require("./manageResultBox");

const { getWindow } = require("../utils/getWindow");
const { getInnerWindow } = require("./getInnerWindow");
const robot = require("robotjs");

const getAndPrepareEtlogWindow = () => {
  const window = getWindow("^etlog");
  if (!window) return null;

  window.bringToTop();

  return window;
};

const initAndValidate = async (elements, minWinWidth = 580) => {
  hideResultBox();

  elements.capsTest.focus();
  robot.keyTap("backspace");

  const elemsValues = getAndStoreElementsValues(elements);
  const etlogWindow = getAndPrepareEtlogWindow();

  await sleep(150);
  if (!etlogWindow)
    return showResultBox({
      msg: "Nie znaleziono EtLoga",
      desc: "Upewnij się, że EtLog jest otwarty.",
      type: "error",
    });

  const bounds = etlogWindow.getBounds();

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

  if (bounds.x < -20 || bounds.y < -20) {
    return showResultBox({
      msg: 'Okno EtLog nie jest w pełni widoczne lub jest zbyt małe, nie jest możliwe kliknięcie przycisku "drukuj".',
      desc: "Powiększ okno i spróbuj ponownie.",
      type: "error",
    });
  }

  if (bounds.width < minWinWidth)
    return showResultBox({
      msg: "Okno EtLog jest zbyt małe lub schowane, nie jest możliwe kliknięcie niektórych elementów interfejsu.",
      desc: "Powiększ lub przywróć okno z paska zadań i spróbuj ponownie.",
      type: "error",
    });

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
