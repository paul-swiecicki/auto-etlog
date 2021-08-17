const Store = require("electron-store");
const store = new Store();

const storeSet = (key, value) => {
  store.set(key, value);
};
const storeGet = (key) => {
  return store.get(key, null);
};

module.exports = { storeSet, storeGet };
