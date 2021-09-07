const { clearEscDetector } = require("../helpers/escDetector");
const { getDividedAmounts } = require("../helpers/getDividedAmounts");
const { getInnerWindow } = require("../helpers/getInnerWindow");
const { initAndValidate } = require("../helpers/initAndValidate");
const { showResultBox } = require("../helpers/manageResultBox");
const { matchProducts } = require("../helpers/matchProducts");
const { showOrder } = require("../orderManagement/showOrder");
const { storeSet, storeGet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getPreparedValuesFromOrder } = require("./getPreparedValuesFromOrder");
const { getWindowRelativeCords } = require("../utils/getWindowRelativeCords");
const robot = require("robotjs");
const atProducts = require("../atProducts");
const { recognizeAndAddUnit } = require("./recognizeAndAddUnit");
const { printSingle } = require("../helpers/printSingle");
const { getProducts } = require("./getProducts");

let printFromOrderClicked = 0;

const printFromOrder = async (
  elements,
  printFromOrderBtn,
  resetOrderDisplay = false
) => {
  const orderPeek = document.getElementById("orderPeek");

  if (resetOrderDisplay) {
    printFromOrderBtn.innerText = "Podgląd zamówienia";
    orderPeek.innerHTML = "";
    printFromOrderClicked = 0;
    return;
  }

  const {
    preparedValues: order,
    headers: orderHeaders,
    isFromStore: isOrderFromStore,
  } = await getPreparedValuesFromOrder(elements.fileInputs.orderFile);

  const { headers, products } = await getProducts(
    elements.fileInputs.productsFile
  );

  if (!order || !products) return;

  let matchedProducts = matchProducts(products, order, headers);
  if (!matchedProducts) return;
  console.log(matchedProducts);
  matchedProducts = recognizeAndAddUnit(matchedProducts);
  console.log(matchedProducts);

  const initStuff = await initAndValidate(elements, 850);

  if (!initStuff) return clearEscDetector();
  const { bounds, elemsValues, isPrintWindow, etlogWindow } = initStuff;
  const windowTitle = etlogWindow.getTitle();
  if (!getInnerWindow(windowTitle, "produkty")) {
    return showResultBox({
      msg: "EtLog nie jest poprawnie przygotowany",
      desc: 'Otwórz okno "Produkty" w EtLogu i zmaksymalizuj je',
      type: "error",
    });
  }

  const filterColorTestCords = getWindowRelativeCords(60, 90, bounds);
  if (robot.getPixelColor(...filterColorTestCords) !== "e3e3e3") {
    return showResultBox({
      msg: "Aby móc wyszukiwać produkty musi być pokazany panel filtrowania",
      desc: "Kliknij przycisk filtrowania (niebieski lejek pod listą produktów)",
      type: "error",
    });
  }

  printFromOrderClicked++;
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

    storeSet("maxAmounts", maxAmounts);

    const rows = document.querySelectorAll("tr.product");

    showResultBox({
      msg: "Drukowanie trwa...",
      desc: "Nie używaj komputera, aby przerwać drukowanie wciśnij Ctrl + C (stan drukowania zostanie zapisany)",
      type: "info",
    });

    // let startFromRow = 0;
    // if (savedRowIndex) startFromRow = savedRowIndex;
    let startFromX = 0,
      startFromY = 0;
    if (isOrderFromStore && orderSave && orderSave.y) {
      const orderSave = storeGet("currentOrderPos");
      const { x, y } = orderSave;
      startFromX = x;
      startFromY = y;
    }

    for (let x = startFromX; x < orderHeaders.amounts.length; x++) {
      for (let y = startFromY; y < matchedProducts.length; y++) {
        const { amounts, product, gtin, unit } = matchedProducts[y];
        const amount = amounts[x];

        const tds = rows[y].querySelectorAll(`td`);
        if (tds.length) {
          const td = tds[x + 1];
          td?.classList.add("done");
        }

        if (!amounts.length || !amount) continue;

        const maxAmount = maxAmounts[product] || 10000;

        const dividedAmounts = getDividedAmounts(elemsValues, {
          amounts: [amount],
          maxAmount,
        });

        atProducts.typeAndFindProduct(gtin, bounds);

        await atProducts.chooseTemplate(unit, bounds);
        await atProducts.clickPrintBtn(
          bounds,
          elemsValues.settings.printWindowLoadTime,
          isPrintWindow
        );
        await printSingle({
          bounds,
          elemsValues,
          dividedAmounts,
          isOrderPrint: true,
        });

        storeSet("currentOrderPos", { x, y: y + 1 });
      }
      startFromY = 0;
    }

    // for (let j = startFromRow; j < matchedProducts.length; j++) {
    //   const { amounts, product, gtin, unit } = matchedProducts[j];
    //   if (!amounts.length) continue;

    //   const maxAmount = maxAmounts[product] || 10000;

    //   const dividedAmounts = getDividedAmounts(elemsValues, {
    //     amounts: [amount],
    //     maxAmount,
    //   });

    //   atProducts.typeAndFindProduct(gtin, bounds);

    //   await atProducts.chooseTemplate(unit, bounds);
    //   await atProducts.clickPrintBtn(
    //     bounds,
    //     elemsValues.settings.printWindowLoadTime,
    //     isPrintWindow
    //   );
    //   await printSingle({
    //     bounds,
    //     elemsValues,
    //     dividedAmounts,
    //     isOrderPrint: true,
    //   });

    //   rows[j]?.classList.add("done");
    //   storeSet("currentOrderRow", j);
    // }
    storeSet("currentOrderPos", { x: 0, y: 0 });

    showResultBox({
      msg: "Drukowanie zamówienia zakończone",
    });
  }
};

module.exports = {
  printFromOrder,
};
