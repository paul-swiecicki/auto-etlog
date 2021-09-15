const { showResultBox } = require("../helpers/manageResultBox");
const { storeGet, storeSet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");

const headersIndexes = {
  row: 1,
  product: 1,
  gtin: 2,
};

const getProducts = async (input) => {
  if (!input.files.length) {
    const { products, headers } = storeGet("products");
    if (products)
      return {
        products,
        headers,
      };
    else {
      return showResultBox({
        msg: "Wybierz plik z produktami aby rozpocząć drukowanie",
        type: "error",
      });
    }
  }

  const { sheet: products, headers: rawHeaders } = await getJsonFromFile(
    input,
    headersIndexes
  );

  const headers = {
    product: rawHeaders[headersIndexes.product],
    gtin: rawHeaders[headersIndexes.gtin],
  };

  storeSet("products", { products, headers });

  return { products, headers };
};

module.exports = {
  getProducts,
};
