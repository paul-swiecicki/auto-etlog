const { showResultBox } = require("../helpers/manageResultBox");
const { storeGet, storeSet } = require("../store");
const { getJsonFromFile } = require("./getJsonFromFile");

const headers = {
  id: "id",
  product: "product",
  gtin: "gtin",
};

const getProducts = async (input) => {
  if (!input.files.length) {
    const products = storeGet("products");
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

  const products = await getJsonFromFile(input, [
    headers.id,
    headers.product,
    headers.gtin,
  ]);

  storeSet("products", products);

  return { products, headers };
};

module.exports = {
  getProducts,
};
