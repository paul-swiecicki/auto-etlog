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
const { showOrder } = require("./helpers/showOrder");
const { storeSet, storeGet } = require("./store");
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

  let printFromOrderClicked = 0;
  const printFromOrderBtn = document.getElementById("printFromOrderBtn");
  printFromOrderBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    escDetector().then(() => {
      process.exit();
    });

    const { preparedValues: order, headers: orderHeaders } =
      await getPreparedValuesFromOrder(elements.fileInputs.orderFile);

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

    printFromOrderClicked++;
    const orderPeek = document.getElementById("orderPeek");
    if (printFromOrderClicked === 1) {
      showOrder(orderPeek, matchedProducts, orderHeaders);
      printFromOrderBtn.innerText = "Drukuj z zamówienia";
    } else {
      printFromOrderBtn.innerText = "Podgląd zamówienia";
      printFromOrderClicked = 0;

      const maxAmounts = {};
      const maxAmountInputs = document.querySelectorAll("input.maxAmount");
      for (let i = 0; i < maxAmountInputs.length; i++) {
        const input = maxAmountInputs[i];

        const product = input.dataset.product;
        const maxAmount = input.value;
        maxAmounts[product] = maxAmount;
      }
      console.log(maxAmounts);
      storeSet("maxAmounts", maxAmounts);

      for (let i = 0; i < order.length; i++) {
        const { amounts, product, gtin } = matchedProducts[i];
        if (!amounts.length) continue;

        const maxAmount = maxAmounts[product];
        const dividedAmounts = getDividedAmounts(elemsValues, {
          amounts,
          maxAmount,
        });
        console.log(dividedAmounts);
        atProducts.typeAndFindProduct(gtin, bounds);
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
    }
    console.log({ order });
    clearEscDetector();
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
