const { storeGet } = require("../store");

const getElementsById = (ids = []) => {
  return ids.reduce((acc, cur) => {
    const element = document.getElementById(cur);
    acc[cur] = element;
    const valueFromStore = storeGet(cur);
    if (valueFromStore) element.value = valueFromStore;

    return acc;
  }, {});
};

module.exports = { getElementsById };
