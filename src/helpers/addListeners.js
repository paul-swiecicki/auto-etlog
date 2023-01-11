const { getElementsValues } = require("../utils/getElementsValues");
const { displayDividedAmounts } = require("./displayDividedAmounts");
const { getAndStoreElementsValues } = require("./getAndStoreElementsValues");
const { getDividedAmounts } = require("./getDividedAmounts");
// const elementsForListeners = [
//   inputs.amount,
//   inputs.maxAmount,
//   settingsInputs.absoluteMaxMultiplier,
//   settingsInputs.splitHalfMaxMultiplier,
//   settingsCheckboxes.noLimitMaxAmount,
//   settingsCheckboxes.isSingleAmounts,
// ];

const addListeners = (elements) => {
  const getAndDisplayDivAmounts = () => {
    const boxes = getElementsValues(elements.settingsCheckboxes, true);
    const settings = getElementsValues(elements.settingsInputs);
    const inputs = getElementsValues(elements.inputs);
    if (!boxes.dividedAmountsPeek) return;

    const dividedAmounts = getDividedAmounts({
      settings,
      boxes,
      inputs,
    });
    displayDividedAmounts(dividedAmounts, "info");
  };

  // getElements = getElementsClosure();
  const { inputs, settingsInputs, settingsCheckboxes } = elements;

  settingsCheckboxes.isDateInput.addEventListener("change", (e) => {
    const target = e.target;
    const checked = target.checked;

    const packDateContainer = inputs.packDate.closest(".inputContainer");
    if (checked) packDateContainer.classList.remove("invisible");
    else packDateContainer.classList.add("invisible");
  });

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
  // fileInputs.addEventListener("input", refreshFiles);
  settingsCheckboxes.isNoLimitMaxAmount.addEventListener(
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
