const { storeSet } = require("../store");

/**
 * @param {object} elements
 * @param {?boolean} checkboxes
 */
const storeElementsValues = (values) => {
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const value = values[key];
      storeSet(key, value);
    }
  }
};

module.exports = { storeElementsValues };
