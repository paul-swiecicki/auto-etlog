const { showResultBox } = require("../helpers/manageResultBox");
const { storeGet, storeSet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");
const { getPreparedValues } = require("./getPreparedValues");

const getHeaders = (indexes, rawHeaders) => {
  return {
    product: rawHeaders[indexes.product],
    amounts: rawHeaders.slice(...indexes.amounts),
  };
};

const getPreparedValuesFromOrder = async (elements, elemsValues) => {
  const input = elements.fileInputs.orderFile;

  if (!input.files.length) {
    const { preparedValues, headers } = storeGet("preparedOrder");
    if (preparedValues)
      return {
        preparedValues,
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

  const headersIndexes = {
    row: parseInt(elemsValues.settings.headerRowNum),
    product: parseInt(elemsValues.settings.productCol) - 1,
    amounts: [
      parseInt(elemsValues.settings.firstAmountCol) - 1,
      parseInt(elemsValues.settings.lastAmountCol) - 1,
    ],
  };

  const { sheet, headers: rawHeaders } = await getJsonFromFile(
    input,
    headersIndexes
    // [headers.product, ...headers.amounts],
  );
  console.log({ headersIndexes, rawHeaders });
  const headers = getHeaders(headersIndexes, rawHeaders);

  const preparedValues = getPreparedValues(sheet, headers);
  console.log(preparedValues);
  storeSet("preparedOrder", { preparedValues, headers });

  return { preparedValues, headers, isFromStore: false };
};

module.exports = {
  getPreparedValuesFromOrder,
};
