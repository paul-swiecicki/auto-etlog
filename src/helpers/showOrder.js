const { storeGet } = require("../store");
const { getDividedAmounts } = require("./getDividedAmounts");
const { showResultBox } = require("./manageResultBox");

const showOrder = (insertElement, matchedProducts, headers) => {
  const maxAmounts = storeGet("maxAmounts");
  const amountsHeaders = headers.amounts;
  let table = "<table>";

  table += "<h3>Podgląd zamówienia</h3> <tr><th>Produkt</th>";

  for (let i = 0; i < amountsHeaders.length; i++) {
    const header = amountsHeaders[i];

    table += `<th>${header}</th>`;
  }
  table += "<th>Max ilość na palecie</th></tr>";

  for (let i = 0; i < matchedProducts.length; i++) {
    const { amounts, product, gtin } = matchedProducts[i];

    if (!amounts.length) continue;

    table += `<tr><td>${product}</td>`;
    for (let i = 0; i < amountsHeaders.length; i++) {
      const amount = amounts[i];

      table += `<td>${amount}</td>`;

      // const dividedAmounts = getDividedAmounts(elemsValues, amounts);
    }

    table += `<td><input class="maxAmount" data-product="${product}" type="number" value="${maxAmounts[product]}"></td> </tr>`;
  }
  table += "</table>";

  insertElement.innerHTML = table;
  //   showResultBox({
  //     msg: "zamówienie",
  //     desc: table,
  //     type: "info",
  //     isHtml: true,
  //   });
};

module.exports = {
  showOrder,
};
