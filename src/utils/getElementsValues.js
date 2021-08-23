// const { storeSet } = require("../store");

/**
 * @param {object} elements
 * @param {?boolean} checkboxes
 * @returns object containing keys as passed object keys and values as input values or checkboxes' states
 */
const getElementsValues = (elements, checkboxes = false) => {
  const values = {};
  for (const key in elements) {
    if (Object.hasOwnProperty.call(elements, key)) {
      const element = elements[key];
      const value = element[checkboxes ? "checked" : "value"];

      values[key] = value;
      // storeSet(key, value);
    }
  }
  return values;
};

module.exports = { getElementsValues };
