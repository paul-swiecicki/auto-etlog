const { clearEscDetector } = require("../helpers/escDetector");
const { getDividedAmounts } = require("../helpers/getDividedAmounts");
const { getInnerWindow } = require("../helpers/getInnerWindow");
const { initAndValidate } = require("../helpers/initAndValidate");
const { showResultBox } = require("../helpers/manageResultBox");
const { matchProducts } = require("../helpers/matchProducts");
const { showOrder } = require("../helpers/showOrder");
const { storeSet, storeGet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getPreparedValuesFromOrder } = require("./getPreparedValuesFromOrder");
const { getWindowRelativeCords } = require("../utils/getWindowRelativeCords");
const robot = require("robotjs");
const atProducts = require("../atProducts");
const { recognizeAndAddUnit } = require("./recognizeAndAddUnit");
const { printSingle } = require("../helpers/printSingle");

let printFromOrderClicked = 0;

const printFromOrder = async (elements, printFromOrderBtn) => {
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

  const matchedProducts = recognizeAndAddUnit(
    matchProducts(products, order, headers)
  );

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

    storeSet("maxAmounts", maxAmounts);

    const rows = document.querySelectorAll("tr.product");

    const savedRowIndex = storeGet("currentOrderRow");
    let startFromRow = 0;
    if (savedRowIndex) startFromRow = savedRowIndex;

    showResultBox({
      msg: "Drukowanie trwa...",
      desc: "Nie używaj komputera, aby zakończyć drukowanie wciśnij Ctrl + C (stan drukowania zostanie zapisany)",
      type: "info",
    });

    for (let i = startFromRow; i < matchedProducts.length; i++) {
      const { amounts, product, gtin, unit } = matchedProducts[i];
      if (!amounts.length) continue;

      const maxAmount = maxAmounts[product] || 10000;

      const dividedAmounts = getDividedAmounts(elemsValues, {
        amounts,
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

      rows[i]?.classList.add("done");
      storeSet("currentOrderRow", i);
    }
    storeSet("currentOrderRow", 0);

    showResultBox({
      msg: "Drukowanie zamówienia zakończone",
    });
  }
};

module.exports = {
  printFromOrder,
};
