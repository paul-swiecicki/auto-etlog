const { getElementsValues } = require("../utils/getElementsValues");
const { displayDividedAmounts } = require("./displayDividedAmounts");
const { getDividedAmounts } = require("./getDividedAmounts");
// const elementsForListeners = [
//   inputs.amount,
//   inputs.maxAmount,
//   settingsInputs.absoluteMaxMultiplier,
//   settingsInputs.splitHalfMaxMultiplier,
//   settingsCheckboxes.noLimitMaxAmount,
//   settingsCheckboxes.isSingleAmounts,
// ];

let getElements = () => {};
let getElementsClosure = () => {
  const { settingsCheckboxes } = require("../elements/checkboxes");
  const { inputs, settingsInputs } = require("../elements/inputs");
  return () => {
    return {
      settingsCheckboxes,
      inputs,
      settingsInputs,
    };
  };
};

const getAndDisplayDivAmounts = () => {
  const { inputs, settingsInputs, settingsCheckboxes } = getElements();
  const settingsBoxesValues = getElementsValues(settingsCheckboxes, true);
  if (!settingsBoxesValues.dividedAmountsPeek) return;
  const inputsValues = getElementsValues(inputs);
  const settingsValues = getElementsValues(settingsInputs);

  const dividedAmounts = getDividedAmounts({
    inputsValues,
    isNoLimitMaxAmount: settingsBoxesValues.noLimitMaxAmount,
    isSingleAmounts: settingsBoxesValues.isSingleAmounts,
    absoluteMaxMultiplier: settingsValues.absoluteMaxMultiplier,
    splitHalfMaxMultiplier: settingsValues.splitHalfMaxMultiplier,
  });
  displayDividedAmounts(dividedAmounts, "info");
};

const addListeners = () => {
  getElements = getElementsClosure();
  const { inputs, settingsInputs, settingsCheckboxes } = getElements();

  inputs.amount.addEventListener("input", getAndDisplayDivAmounts);
  inputs.maxAmount.addEventListener("input", getAndDisplayDivAmounts);
  settingsInputs.absoluteMaxMultiplier.addEventListener(
    "input",
    getAndDisplayDivAmounts
  );
  settingsInputs.splitHalfMaxMultiplier.addEventListener(
    "input",
    getAndDisplayDivAmounts
  );
  settingsCheckboxes.noLimitMaxAmount.addEventListener(
    "change",
    getAndDisplayDivAmounts
  );
  settingsCheckboxes.isSingleAmounts.addEventListener(
    "change",
    getAndDisplayDivAmounts
  );
};

// const addListeners = (elements) => {
//   const listenerFn = getAndDisplayDivAmounts(elements);
//   elements.forEach((element) => {
//     element.addEventListener("input", listenerFn);
//   });
// };

module.exports = { addListeners };
