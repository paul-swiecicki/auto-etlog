const { storeGet } = require("../store");

const getElementsById = (ids = [], checkStore = true) => {
  return ids.reduce((acc, cur) => {
    const element = document.getElementById(cur);
    acc[cur] = element;
    if (checkStore) {
      const valueFromStore = storeGet(cur);
      if (valueFromStore) element.value = valueFromStore;
    }

    return acc;
  }, {});
};

module.exports = { getElementsById };
