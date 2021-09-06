const stringSimilarity = require("string-similarity");
const { showResultBox } = require("./manageResultBox");

const minRating = 0.2;

const matchProducts = (products, order, headers) => {
  const preparedProducts = [];

  const productKey = headers.product;
  const productsArr = products.map((row) => row[productKey]);

  for (let i = 0; i < order.length; i++) {
    const orderRow = order[i];
    const orderProduct = orderRow.product;

    let similarityObj;
    try {
      similarityObj = stringSimilarity.findBestMatch(orderProduct, productsArr);
    } catch (error) {
      console.log(error);
      return showResultBox({
        msg: "Coś poszło nie tak podczas wyszukiwania produktów",
        desc: "Sprawdź, czy załadowane są odpowiednie pliki",
        type: "error",
      });
    }

    if (similarityObj.bestMatch.rating < minRating) continue;
    const matchedProduct = products[similarityObj.bestMatchIndex];

    preparedProducts.push({
      product: matchedProduct[headers.product],
      gtin: matchedProduct[headers.gtin],
      amounts: orderRow.amounts,
    });
  }

  return preparedProducts;
};

module.exports = {
  matchProducts,
};
