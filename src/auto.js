// const nodeAbi = require("node-abi");
const robot = require("robotjs");

const { escDetector, clearEscDetector } = require("./helpers/escDetector");
const { getDividedAmounts } = require("./helpers/getDividedAmounts");
const { showResultBox } = require("./helpers/manageResultBox");
const { getWindow } = require("./utils/getWindow");
const { logColor } = require("./devUtils/logColor");

const { addListeners } = require("./helpers/addListeners");
const { checkStoredCheckboxes } = require("./helpers/checkStoredCheckboxes");
const {
  getPreparedValuesFromOrder,
} = require("./orderManagement/getPreparedValuesFromOrder");
const { printSingle } = require("./helpers/printSingle");
const { initAndValidate } = require("./helpers/initAndValidate");

const atProducts = require("./atProducts");
const { getJsonFromFile } = require("./orderManagement/getJsonFromFile");
const { matchProducts } = require("./helpers/matchProducts");
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
  const { settingsInputs, inputs, fileInputs } = require("./elements/inputs");
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
  };
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

  // of.addEventListener("change", getOrder, false);

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

    console.log(isPrintWindow);
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

  // const orderFileInput = document.getElementById("orderFile");
  // const productsFileInput = document.getElementById("productsFile");

  const printFromOrderBtn = document.getElementById("printFromOrderBtn");
  printFromOrderBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    escDetector().then(() => {
      process.exit();
    });

    const order = await getPreparedValuesFromOrder(
      elements.fileInputs.orderFile
    );

    const headers = {
      id: "id",
      product: "product",
      gtin: "gtin",
    };
    const products = await getJsonFromFile(elements.fileInputs.productsFile, [
      headers.id,
      headers.product,
      headers.gtin,
    ]);

    const matchedProducts = matchProducts(products, order, headers);

    console.log({ order, products });

    const initStuff = await initAndValidate(elements);

    if (!initStuff) return clearEscDetector();
    const { bounds, elemsValues, isPrintWindow } = initStuff;

    for (let i = 0; i < order.length; i++) {
      const { amounts, product, gtin } = matchedProducts[i];

      // if (!amounts.length) continue;

      atProducts.typeAndFindProduct(gtin, bounds);

      const dividedAmounts = getDividedAmounts(elemsValues, amounts);
      console.log({ product, dividedAmounts });

      await atProducts.clickPrintBtn(
        bounds,
        elemsValues.settings.printWindowLoadTime,
        isPrintWindow
      );

      await printSingle({
        bounds,
        elemsValues,
        dividedAmounts,
      });
    }
    console.log({ order });
    clearEscDetector();
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
