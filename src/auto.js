// const nodeAbi = require("node-abi");
const robot = require("robotjs");

const { escDetector, clearEscDetector } = require("./helpers/escDetector");
const { getDividedAmounts } = require("./helpers/getDividedAmounts");
const { showResultBox } = require("./helpers/manageResultBox");
const { getWindow } = require("./utils/getWindow");
const { logColor } = require("./devUtils/logColor");

const { addListeners } = require("./helpers/addListeners");
const { checkStoredCheckboxes } = require("./helpers/checkStoredCheckboxes");
const { printSingle } = require("./helpers/printSingle");
const { initAndValidate } = require("./helpers/initAndValidate");

const atProducts = require("./atProducts");
const { printFromOrder } = require("./orderManagement/printFromOrder");
// if (elemsValues.boxes.doValidate) {
//   try {
//     const colorForValidation = robot.getPixelColor(
//       leftEdgeX(260, bounds),
//       topEdgeY(70, bounds)
//     );
//     console.log(colorForValidation);
//     if (
//       colorForValidation !== "ffffff" &&
//       colorForValidation !== "e3e3e3"
//     ) {
//       return showResultBox({
//         msg: "Wygląda na to, że coś jest nie tak.",
//         desc: "Upewnij się, że w EtLogu jest otwarte i zmaksymalizowane okno produktów.",
//         type: "error",
//       });
//     }
//   } catch (err) {
//     return showResultBox({
//       msg: "Nie znaleziono okna EtLog",
//       desc: "Prawdopodobnie okno EtLog jest zminimalizowane lub jest poza ekranem.",
//       type: "error",
//     });
//   }
// }

const getBasicElements = () => {
  const {
    settingsInputs,
    inputs,
    fileInputs,
    capsTest,
  } = require("./elements/inputs");
  const {
    settingsCheckboxes,
    checkboxesIds,
  } = require("./elements/checkboxes");
  checkStoredCheckboxes(checkboxesIds);

  return {
    inputs,
    fileInputs,
    settingsInputs,
    settingsCheckboxes,
    capsTest,
  };
};

const DOMLoaded = () => {
  const getColorBtn = document.getElementById("getColor");

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

  const tabs = document.querySelectorAll("button.tab");
  const tabContainer = document.querySelector(".tabs");
  const printContainers = document.querySelectorAll(".printContainer");

  tabContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("unactive")) {
      tabs[0].classList.toggle("unactive");
      tabs[1].classList.toggle("unactive");

      printContainers[0].classList.toggle("unactive");
      printContainers[1].classList.toggle("unactive");
    }
  });

  const elements = getBasicElements();
  addListeners(elements);
  const printBtn = document.getElementById("print");
  printBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    escDetector().then(() => {
      process.exit();
    });

    const initStuff = await initAndValidate(elements);

    if (!initStuff) return clearEscDetector();
    const { bounds, elemsValues, isPrintWindow } = initStuff;

    console.log(bounds);

    const dividedAmounts = getDividedAmounts(elemsValues);

    if (!elemsValues.inputs.amount) {
      return showResultBox({
        msg: "Pole 'Liczba szt. na jednostkę' jest wymagane",
        type: "error",
      });
    }

    if (!isPrintWindow) {
      await atProducts.clickPrintBtn(
        bounds,
        elemsValues.settings.printWindowLoadTime,
        isPrintWindow
      );
    }

    await printSingle({
      bounds,
      elemsValues,
      dividedAmounts,
    });

    clearEscDetector();
  });

  elements.capsTest.addEventListener("keyup", function (e) {
    if (e.getModifierState("CapsLock")) {
      robot.keyTap("capslock");
    }
  });

  const printFromOrderBtn = document.getElementById("printFromOrderBtn");
  printFromOrderBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    escDetector().then(() => {
      process.exit();
    });

    await printFromOrder(elements, printFromOrderBtn);

    clearEscDetector();
  });

  const resetOrderDisplay = () => {
    printFromOrder(elements, printFromOrderBtn, true);
  };

  const { orderFile, productsFile } = elements.fileInputs;
  orderFile.addEventListener("change", resetOrderDisplay, false);
  productsFile.addEventListener("change", resetOrderDisplay, false);
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
