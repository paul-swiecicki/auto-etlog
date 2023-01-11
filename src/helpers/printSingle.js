const atPrint = require("../atPrint");
const { displayDividedAmounts } = require("./displayDividedAmounts");

const printSingle = async ({
  elemsValues,
  bounds,
  dividedAmounts,
  isOrderPrint = false,
}) => {
  const { inputs, settings, boxes } = elemsValues;

  const isDateInput = boxes.isDateInput;

  const firstDivAmount = dividedAmounts[0];

  atPrint.fillTextInputs({
    elemsValues,
    amount: firstDivAmount[0],
    pages: firstDivAmount[1],
    bounds,
  });
  await atPrint.clickPrintBtns(bounds, settings);

  let prevAmount;
  for (let i = 1; i < dividedAmounts.length; i++) {
    const [curAmount, pages] = dividedAmounts[i];

    if (curAmount !== prevAmount)
      atPrint.replaceAmount(curAmount, pages, bounds, isDateInput);

    await atPrint.clickPrintBtns(bounds, settings);
    prevAmount = curAmount;
  }
  atPrint.clickCloseBtn(bounds);

  if (!isOrderPrint)
    displayDividedAmounts(dividedAmounts, "success", elemsValues.inputs.amount);
};

module.exports = {
  printSingle,
};
