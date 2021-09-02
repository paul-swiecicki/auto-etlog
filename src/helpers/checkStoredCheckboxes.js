const { storeGet } = require("../store");

let getElements = () => {};
const getElementsClosure = () => {
  const { settingsCheckboxes } = require("../elements/checkboxes");
  const { inputs, settingsInputs, fileInputs } = require("../elements/inputs");
  return () => {
    return {
      settingsCheckboxes,
      inputs,
      settingsInputs,
    };
  };
};

const checkStoredCheckboxes = (keys = []) => {
  getElements = getElementsClosure();
  const { settingsCheckboxes } = getElements();

  keys.forEach((key) => {
    const storedVal = storeGet(key);
    if (storedVal !== null) settingsCheckboxes[key].checked = storedVal;
  });
};

module.exports = {
  checkStoredCheckboxes,
};
