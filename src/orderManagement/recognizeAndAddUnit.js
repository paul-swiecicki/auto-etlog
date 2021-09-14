const recognizeAndAddUnit = (data) => {
  const dataWithUnits = data.map((row) => {
    const kgMatch = row.product.match(/\d\s*kg/i);

    const rowWithUnit = Object.assign({}, row);
    rowWithUnit.unit = kgMatch ? "kg" : "szt";
    return rowWithUnit;
  });

  return dataWithUnits;
};

module.exports = {
  recognizeAndAddUnit,
};
