const { getDividedAmounts } = require("./getDividedAmounts");
const { showResultBox } = require("./manageResultBox");

const showOrder = (elemsValues, matchedProducts, headers) => {
  const amountsHeaders = headers.amounts;
  let table = "<table>";

  table += "<tr><th>Produkt</th>";

  for (let i = 0; i < amountsHeaders.length; i++) {
    const header = amountsHeaders[i];

    table += `<th>${header}</th>`;
  }
  table += "</tr>";

  for (let i = 0; i < matchedProducts.length; i++) {
    const { amounts, product, gtin } = matchedProducts[i];

    if (!amounts.length) continue;

    table += `<tr><td>${product}</td>`;
    for (let i = 0; i < amountsHeaders.length; i++) {
      const amount = amounts[i];

      table += `<td>${amount}</td>`;
      //   const amountLength = (amount + "").length;
      //   table += `| ${amount}${" ".repeat(6 - amountLength)} `;
      // }
      // table += "\n";

      // for (let i = 0; i < amountsHeaders.length; i++) {
      //   const header = amountsHeaders[i];

      //   const
      // }

      // const dividedAmounts = getDividedAmounts(elemsValues, amounts);
    }
    table += "</tr>";
  }
  table += "</table>";
  showResultBox({
    msg: "zamówienie",
    desc: table,
    type: "info",
    isHtml: true,
  });
};

module.exports = {
  showOrder,
};
