const { storeGet, storeSet } = require("../store");

const showOrder = (insertElement, matchedProducts, headers) => {
  const maxAmounts = storeGet("maxAmounts");
  const amountsHeaders = headers.amounts;

  let currentOrderPos = storeGet("currentOrderPos");

  if (currentOrderPos && currentOrderPos.y) {
    if (
      !confirm(
        `Drukowanie nie zostało ostatnio dokończone. Czy chcesz wznowić drukowanie? (Drukowanie zostanie rozpoczęte od ${
          matchedProducts[currentOrderPos.y]?.product
        } w ${currentOrderPos.x + 1} kolumnie)`
      )
    ) {
      currentOrderPos = { x: 0, y: 0 };
      storeSet("currentOrderPos", { x: 0, y: 0 });
    }
  }

  let table = "<table>";
  table += "<h3>Podgląd zamówienia</h3> <tr><th>Produkt</th>";

  for (let i = 0; i < amountsHeaders.length; i++) {
    const header = amountsHeaders[i];

    table += `<th>${header}</th>`;
  }
  table += "<th>Max ilość na palecie</th></tr>";

  for (let y = 0; y < matchedProducts.length; y++) {
    const { amounts, product, gtin } = matchedProducts[y];

    if (!amounts.length) continue;

    table += `<tr class="product" data-product="${product}"><td>${product}</td>`;
    for (let x = 0; x < amountsHeaders.length; x++) {
      const amount = amounts[x];

      let doneClass = "";
      if (
        currentOrderPos &&
        (x < currentOrderPos.x ||
          (x === currentOrderPos.x && y < currentOrderPos.y))
      ) {
        doneClass = "done";
      }
      table += `<td class=${doneClass}>${amount}</td>`;
    }

    table += `<td><input class="maxAmount" data-product="${product}" type="number" value="${
      maxAmounts && maxAmounts[product]
    }"></td> </tr>`;
  }
  table += "</table>";

  insertElement.innerHTML = table;
};

module.exports = {
  showOrder,
};
