const stringSimilarity = require("string-similarity");

const minRating = 0.2;

const matchProducts = (products, order, headers) => {
  // const productsArr = [];
  // for (let j = 0; j < products.length; j++) {
  //   const product = products[j].prod_name;

  //   productsArr.push(product);
  // }
  const preparedProducts = [];

  const productKey = headers.product;
  const productsArr = products.map((row) => row[productKey]);
  console.log({ productsArr, products });

  for (let i = 0; i < order.length; i++) {
    const orderRow = order[i];
    const orderProduct = orderRow.product;

    const similarityObj = stringSimilarity.findBestMatch(
      orderProduct,
      productsArr
    );

    if (similarityObj.bestMatch.rating < minRating) continue;
    console.log(orderProduct, similarityObj.bestMatch, similarityObj);
    const matchedProduct = products[similarityObj.bestMatchIndex];
    console.log(matchedProduct);

    preparedProducts.push({
      product: matchedProduct[headers.product],
      gtin: matchedProduct[headers.gtin],
      amounts: orderRow.amounts,
    });

    // for (let j = 0; j < products.length; j++) {
    //   const product = products[j].prod_name;

    //   console.log({ product, orderProduct });
    //   if (product === orderProduct) {
    //     console.log(product);
    //   }
    // }
  }
  console.log(preparedProducts);
  return preparedProducts;
};

module.exports = {
  matchProducts,
};
