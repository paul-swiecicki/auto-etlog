const XLSX = require("xlsx");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getPreparedValues } = require("./getPreparedValues");

const headers = {
  product: "product",
  amounts: ["DC LUBARTÓW", "DC MSZCZONÓW", "DC WYSZKÓW", "DC WARSZAWA"],
};

const getPreparedValuesFromOrder = async (input) => {
  const order = await getJsonFromFile(
    input,
    [headers.product, ...headers.amounts],
    true
  );
  console.log(order);
  const preparedValues = getPreparedValues(order, headers);
  console.log(preparedValues);

  return { preparedValues, headers };
};

module.exports = {
  getPreparedValuesFromOrder,
};
