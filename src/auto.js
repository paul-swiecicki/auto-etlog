// const nodeAbi = require("node-abi");
const robot = require("robotjs");

const atPrint = require("./atPrint");
const atProducts = require("./atProducts");
const { escDetector, clearEscDetector } = require("./helpers/escDetector");
const { getDividedAmounts } = require("./helpers/getDividedAmounts");
const { hideResultBox, showResultBox } = require("./helpers/manageResultBox");
const { getWindow } = require("./utils/getWindow");
const { getElementsById } = require("./utils/getElementsById");
const { getElementsValues } = require("./utils/getElementsValues");
const { storeGet } = require("./store");
const { leftEdgeX, topEdgeY } = require("./utils/getRelativeCords");
const { sleep } = require("./utils/sleep");
const { displayDividedAmounts } = require("./helpers/displayDividedAmounts");
const { storeElementsValues } = require("./utils/storeElementsValues");

const { addListeners } = require("./helpers/addListeners");

const logColor = (pixelColor) => {
  console.log(`%c ${pixelColor}`, `color: white; background: #${pixelColor}`);
};

const findColor = ({ bitmap, colors }) => {
  for (let i = 0; i < bitmap.width; i++) {
    for (let j = 0; j < bitmap.height; j++) {
      const pixelColor = bitmap.colorAt(i, j);
      console.log({ x: i, y: j, pixelColor });
      if (colors.includes(pixelColor)) return { x: i, y: j };
    }
  }
  console.log(colors);
  return null;
};

const getInnerWindow = (fullTitle, innerWindow) => {
  const regExObj = new RegExp(`etlog \\(.+\\) - \\[${innerWindow}`, "i");
  const matchResult = fullTitle.match(regExObj);
  return matchResult;
};

const getAndPrepareEtlogWindow = () => {
  const window = getWindow("^etlog");
  if (!window) return null;

  window.bringToTop();

  return window;
};

const DOMLoaded = () => {
  const findBtn = document.getElementById("find");
  const getColorBtn = document.getElementById("getColor");

  findBtn.addEventListener("click", () => {
    const window = getWindow("etlog");
    // window.bringToTop();
    const bounds = window.getBounds();
    console.log(bounds);
    const bitmap = robot.screen.capture(bounds.x, bounds.y, 350, bounds.height);

    // const pos = findColorAndLog({
    //   bitmap,
    //   width: bounds.width,
    //   height: bounds.height,
    //   color: "360036",
    //   pixelsAmount: 5,
    // });

    // console.log(pos);
  });

  getColorBtn.addEventListener("click", () => {
    setInterval(() => {
      const cords = robot.getMousePos();
      console.log(cords);
      const bitmap = robot.screen.capture(cords.x, cords.y, 10, 10);

      const pixelColor = bitmap.colorAt(0, 0);
      logColor(pixelColor);
    }, 1000);
  });

  showResultBox({
    msg: "Zanim zaczniemy",
    desc: "Pamiętaj aby zmaksymalizować wewnętrzne okno (z produktami) w EtLogu",
    type: "warning",
  });

  const { settingsInputs, inputs } = require("./elements/inputs");
  const {
    settingsCheckboxes,
    checkboxesIds,
  } = require("./elements/checkboxes");

  const checkStoredCheckboxes = (keys = []) => {
    keys.forEach((key) => {
      const storedVal = storeGet(key);
      if (storedVal !== null) settingsCheckboxes[key].checked = storedVal;
    });
  };
  checkStoredCheckboxes(checkboxesIds);

  addListeners();

  const printBtn = document.getElementById("print");
  printBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    hideResultBox();

    const etlogWindow = getAndPrepareEtlogWindow();
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

    const bounds = etlogWindow.getBounds();

    const settingsBoxesValues = getElementsValues(settingsCheckboxes, true);
    storeElementsValues(settingsBoxesValues);
    const settingsValues = getElementsValues(settingsInputs);
    storeElementsValues(settingsValues);
    const inputsValues = getElementsValues(inputs);
    storeElementsValues(inputsValues);

    if (settingsBoxesValues.doValidate) {
      try {
        const colorForValidation = robot.getPixelColor(
          leftEdgeX(260, bounds),
          topEdgeY(70, bounds)
        );
        console.log(colorForValidation);
        if (
          colorForValidation !== "ffffff" &&
          colorForValidation !== "e3e3e3"
        ) {
          return showResultBox({
            msg: "Wygląda na to, że coś jest nie tak.",
            desc: "Upewnij się, że w EtLogu jest otwarte i zmaksymalizowane okno produktów.",
            type: "error",
          });
        }
      } catch (err) {
        return showResultBox({
          msg: "Nie znaleziono okna EtLog",
          desc: "Prawdopodobnie okno EtLog jest zminimalizowane lub jest poza ekranem.",
          type: "error",
        });
      }
    }
    escDetector().then(() => {
      process.exit();
    });

    if (!inputsValues.amount) {
      return showResultBox({
        msg: "Pole 'Liczba szt. na jednostkę' jest wymagane",
        type: "error",
      });
    }
    const dividedAmounts = getDividedAmounts(inputsValues);

    try {
      await atProducts.clickPrintBtn(
        bounds,
        settingsValues.printWindowLoadTime
      );
    } catch (err) {
      if (err.message === atProducts.windowTooSmallError)
        return showResultBox({
          msg: 'Okno EtLog jest zbyt małe aby było możliwe kliknięcie przycisku "drukuj".',
          desc: "Powiększ okno i spróbuj ponownie.",
          type: "error",
        });
    }

    const isDateInput = settingsInputs.isDateInput.checked;

    atPrint.fillTextInputs({
      ssccAmount: inputsValues.ssccAmount,
      additionalText: inputsValues.additionalText,
      amount: dividedAmounts[0],
      bounds,
      isDateInput,
    });
    await atPrint.clickPrintBtns(bounds, settingsValues.btnsGenTime);

    let prevAmount;
    for (let i = 1; i < dividedAmounts.length; i++) {
      const curAmount = dividedAmounts[i];
      console.log({ curAmount, prevAmount });

      if (curAmount !== prevAmount) atPrint.replaceAmount(curAmount, bounds);

      await atPrint.clickPrintBtns(bounds, settingsValues.btnsGenTime);
      prevAmount = curAmount;
    }
    atPrint.clickCloseBtn(bounds);

    showResultBox({
      msg: `Zrobione! Ilości: "${inputsValues.amount}"`,
      desc: `Podzielone na (${dividedAmounts})`,
    });
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
