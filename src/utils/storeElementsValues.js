const { storeSet } = require("../store");

/**
 * @param {object} elements
 * @param {?boolean} checkboxes
 */
const storeElementsValues = (values) => {
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const value = values[key];
      //   console.log({ key, value });
      storeSet(key, value);
    }
  }
};

module.exports = { storeElementsValues };
