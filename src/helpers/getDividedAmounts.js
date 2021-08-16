const getQuotientAndRemainder = (dividend, divisor) => {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return { quotient, remainder };
};

const absoluteMaxMultiplier = 1.05;
const splitHalfMaxMultiplier = 1.6;
const doubleAbsMaxMultiplier = 2.11;

const getDividedAmounts = (inputsValues) => {
  const dividedAmounts = [];
  let { maxAmount, amount } = inputsValues;
  maxAmount = parseFloat(maxAmount);
  const amounts = amount.trim().split(" ");

  let prevAmount = null;
  for (let i = 0; i < amounts.length; i++) {
    const curAmount = parseFloat(amounts[i]);
    if (!curAmount) continue;

    console.log({ curAmount, maxAmount, x: curAmount > maxAmount });
    if (curAmount > maxAmount) {
      const absoluteMax = maxAmount * absoluteMaxMultiplier + 3;
      console.log(curAmount, maxAmount, absoluteMax);
      if (curAmount < absoluteMax) {
        const { quotient, remainder } = getQuotientAndRemainder(curAmount, 2);

        dividedAmounts.push(quotient, quotient + remainder);
      } else if (curAmount < maxAmount * splitHalfMaxMultiplier) {
        const { quotient, remainder } = getQuotientAndRemainder(
          curAmount + prevAmount,
          2
        );

        dividedAmounts.push(quotient, quotient + remainder);
      } else if (
        curAmount > maxAmount * 2 &&
        curAmount < maxAmount * doubleAbsMaxMultiplier
      ) {
        const { quotient, remainder } = getQuotientAndRemainder(
          curAmount + prevAmount,
          2
        );

        dividedAmounts.push(quotient, quotient + remainder);
      } else {
        const { quotient: fullAmounts, remainder: rest } =
          getQuotientAndRemainder(curAmount, maxAmount);

        for (let j = 0; j < fullAmounts; j++) {
          dividedAmounts.push(maxAmount);
        }
        dividedAmounts.push(rest);
      }
    } else {
      dividedAmounts.push(curAmount);
    }

    prevAmount = curAmount;
  }

  return dividedAmounts;
};

module.exports = { getDividedAmounts };
