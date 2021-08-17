const { storeSet } = require("../store");

const getElementsValues = (elements = {}) => {
  const values = {};
  for (const key in elements) {
    if (Object.hasOwnProperty.call(elements, key)) {
      const element = elements[key];
      const value = element.value;

      values[key] = value;
      storeSet(key, value);
    }
  }
  return values;
};

module.exports = { getElementsValues };
