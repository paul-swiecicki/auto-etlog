const { storeGet, storeSet } = require("../store");
const { getDividedAmounts } = require("./getDividedAmounts");
const { showResultBox } = require("./manageResultBox");

const showOrder = (insertElement, matchedProducts, headers) => {
  const maxAmounts = storeGet("maxAmounts");
  const amountsHeaders = headers.amounts;

  let savedRowIndex = storeGet("currentOrderRow");

  if (savedRowIndex) {
    if (
      !confirm(
        `Drukowanie nie zostało ostatnio dokończone. Czy chcesz wznowić drukowanie? (Drukowanie zostanie rozpoczęte od ${matchedProducts[savedRowIndex]?.product})`
      )
    ) {
      savedRowIndex = 0;
      storeSet("currentOrderRow", 0);
    }
  }

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
    const doneClass = savedRowIndex && i < savedRowIndex ? "done" : "";

    table += `<tr class="product ${doneClass}" data-product="${product}"><td>${product}</td>`;
    for (let i = 0; i < amountsHeaders.length; i++) {
      const amount = amounts[i];

      table += `<td>${amount}</td>`;

      // const dividedAmounts = getDividedAmounts(elemsValues, amounts);
    }

    table += `<td><input class="maxAmount" data-product="${product}" type="number" value="${maxAmounts[product]}"></td> </tr>`;
  }
  table += "</table>";

  insertElement.innerHTML = table;
};

module.exports = {
  showOrder,
};
