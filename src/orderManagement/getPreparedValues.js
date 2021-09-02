const getPreparedValues = (order, headers) => {
  const preparedValues = [];

  for (let i = 0; i < order.length; i++) {
    const row = order[i];
    const preparedObj = {};

    //   console.log("ROW", row);
    const rowValues = [];

    for (const col in row) {
      if (Object.hasOwnProperty.call(row, col)) {
        const cellValue = row[col];

        if (col === headers.product) {
          preparedObj.product = cellValue;
        } else if (cellValue && typeof cellValue === "number") {
          // console.log({ col, cellValue });
          rowValues.push(cellValue);
        }
      }
    }
    if (!rowValues.length) continue;
    preparedObj.amounts = rowValues;
    preparedValues.push(preparedObj);
  }

  return preparedValues;
};

module.exports = {
  getPreparedValues,
};
