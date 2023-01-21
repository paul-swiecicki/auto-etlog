const getPreparedValues = (order, headers) => {
  const preparedValues = [];
  const amountColumns = headers.amounts.length;

  for (let i = 0; i < order.length; i++) {
    const row = order[i];
    const preparedObj = {};

    const rowValues = [];

    let zerosCount = 0;
    for (const col in row) {
      if (Object.hasOwnProperty.call(row, col)) {
        const cellValue = row[col];

        const isAmount = headers.amounts.includes(col);
        if (col === headers.product) {
          preparedObj.product = cellValue;
        } else if (cellValue && typeof cellValue === "number" && isAmount) {
          rowValues.push(cellValue);
        } else if (!cellValue && isAmount) {
          rowValues.push(0);
          zerosCount++;
        }
      }
    }
    const isNoValues = amountColumns === zerosCount;
    zerosCount = 0;
    if (!rowValues.length || isNoValues) continue;
    preparedObj.amounts = rowValues;
    preparedValues.push(preparedObj);
  }

  return preparedValues;
};

module.exports = {
  getPreparedValues,
};
