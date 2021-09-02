const XLSX = require("xlsx");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getOrder } = require("./getOrder");
const { getPreparedValues } = require("./getPreparedValues");

const headers = {
  product: "Produkt",
  amounts: ["DC LUBARTÓW", "DC MSZCZONÓW", "DC WYSZKÓW", "DC WARSZAWA"],
};

const getPreparedValuesFromOrder = async (input) => {
  const order = await getJsonFromFile(input, [
    headers.product,
    ...headers.amounts,
  ]);
  console.log(order);
  const preparedValues = getPreparedValues(order, headers);
  console.log(preparedValues);
  return preparedValues;
};

module.exports = {
  getPreparedValuesFromOrder,
};
