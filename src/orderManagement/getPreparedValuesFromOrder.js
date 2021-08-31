const XLSX = require("xlsx");
const { getOrder } = require("./getOrder");
const { getPreparedValues } = require("./getPreparedValues");

const headers = {
  product: "Produkt",
  amounts: ["DC LUBARTÓW", "DC MSZCZONÓW", "DC WYSZKÓW", "DC WARSZAWA"],
};

const getPreparedValuesFromOrder = async (input) => {
  const order = await getOrder(input, headers);
  console.log(order);
  const preparedValues = getPreparedValues(order, headers);
  console.log(preparedValues);
  return preparedValues;
};

module.exports = {
  getPreparedValuesFromOrder,
};
