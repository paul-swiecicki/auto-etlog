const { getElementsValues } = require("../utils/getElementsValues");
const { storeElementsValues } = require("../utils/storeElementsValues");

const getAndStoreElementsValues = (elements) => {
  const boxes = getElementsValues(elements.settingsCheckboxes, true);
  storeElementsValues(boxes);
  const settings = getElementsValues(elements.settingsInputs);
  storeElementsValues(settings);
  const inputs = getElementsValues(elements.inputs);
  storeElementsValues(inputs);
  return {
    boxes,
    settings,
    inputs,
  };
};

module.exports = {
  getAndStoreElementsValues,
};
