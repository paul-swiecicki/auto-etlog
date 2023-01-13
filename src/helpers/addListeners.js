const { getElementsValues } = require("../utils/getElementsValues");
const { displayDividedAmounts } = require("./displayDividedAmounts");
const { getAndStoreElementsValues } = require("./getAndStoreElementsValues");
const { getDividedAmounts } = require("./getDividedAmounts");

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
  settingsCheckboxes.isNoLimitMaxAmount.addEventListener(
    "change",
    getAndDisplayDivAmounts
  );
  settingsCheckboxes.isSingleAmounts.addEventListener(
    "change",
    getAndDisplayDivAmounts
  );
};

module.exports = { addListeners };
