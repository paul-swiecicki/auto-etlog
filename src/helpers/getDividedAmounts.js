const getDividedAmounts = (inputsValues) => {
  const dividedAmounts = [];
  const amounts = inputsValues.amount.trim().split(" ");

  for (let i = 0; i < amounts.length; i++) {
    const curAmount = amounts[i];
    if (!curAmount) continue;

    if (curAmount > inputsValues.maxAmount) {
      const fullAmounts = Math.floor(curAmount / inputsValues.maxAmount);
      const rest = curAmount % inputsValues.maxAmount;

      for (let j = 0; j < fullAmounts; j++) {
        dividedAmounts.push(inputsValues.maxAmount);
      }
      dividedAmounts.push(rest);
    } else {
      dividedAmounts.push(curAmount);
    }
  }

  return dividedAmounts;
};

module.exports = { getDividedAmounts };
