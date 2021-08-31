const atPrint = require("../atPrint");
const { displayDividedAmounts } = require("./displayDividedAmounts");

const printSingle = async ({ elemsValues, bounds, dividedAmounts }) => {
  const { inputs, settings, boxes } = elemsValues;

  const isDateInput = boxes.isDateInput;

  const firstDivAmount = dividedAmounts[0];

  atPrint.fillTextInputs({
    ssccAmount: inputs.ssccAmount,
    additionalText: inputs.additionalText,
    amount: firstDivAmount[0],
    pages: firstDivAmount[1],
    bounds,
    isDateInput,
  });
  await atPrint.clickPrintBtns(
    bounds,
    firstDivAmount[1],
    settings.btnsGenTime,
    settings.anotherPageWaitPercent
  );

  let prevAmount;
  for (let i = 1; i < dividedAmounts.length; i++) {
    const [curAmount, pages] = dividedAmounts[i];

    if (curAmount !== prevAmount)
      atPrint.replaceAmount(curAmount, pages, bounds, isDateInput);

    await atPrint.clickPrintBtns(
      bounds,
      pages,
      settings.btnsGenTime,
      settings.anotherPageWaitPercent
    );
    prevAmount = curAmount;
  }
  atPrint.clickCloseBtn(bounds);

  displayDividedAmounts(dividedAmounts, "success", elemsValues.inputs.amount);
};

module.exports = {
  printSingle,
};
