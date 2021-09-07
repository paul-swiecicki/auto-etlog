const { showResultBox } = require("../helpers/manageResultBox");
const { storeGet, storeSet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getPreparedValues } = require("./getPreparedValues");

const headers = {
  product: "product",
  amounts: ["DC LUBARTÓW", "DC MSZCZONÓW", "DC WYSZKÓW", "DC WARSZAWA"],
};

const getPreparedValuesFromOrder = async (input) => {
  if (!input.files.length) {
    const storedValues = storeGet("preparedValues");
    if (storedValues)
      return {
        preparedValues: storedValues,
        headers,
        isFromStore: true,
      };
    else {
      return showResultBox({
        msg: "Wybierz plik zamówienia aby rozpocząć drukowanie",
        type: "error",
      });
    }
  }

  const order = await getJsonFromFile(
    input,
    [headers.product, ...headers.amounts],
    true
  );
  console.log(order);
  const preparedValues = getPreparedValues(order, headers);
  console.log(preparedValues);
  storeSet("preparedValues", preparedValues);

  return { preparedValues, headers, isFromStore: false };
};

module.exports = {
  getPreparedValuesFromOrder,
};
