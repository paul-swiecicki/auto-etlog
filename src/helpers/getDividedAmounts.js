const getQuotientAndRemainder = (dividend, divisor) => {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return { quotient, remainder };
};

const getComplexDivisions = (
  curAmount,
  maxAmount,
  absoluteMaxMultiplier,
  splitHalfMaxMultiplier
) => {
  const absoluteMax = maxAmount * absoluteMaxMultiplier + 2;
  const dividedAmounts = [];

  if (curAmount < absoluteMax) {
    dividedAmounts.push(curAmount);
  } else if (curAmount < maxAmount * splitHalfMaxMultiplier) {
    const { quotient, remainder } = getQuotientAndRemainder(curAmount, 2);

    dividedAmounts.push(quotient, quotient + remainder);
  } else if (
    curAmount > maxAmount * 2 &&
    curAmount < maxAmount * absoluteMaxMultiplier * 2
  ) {
    const { quotient, remainder } = getQuotientAndRemainder(curAmount, 2);

    dividedAmounts.push(quotient, quotient + remainder);
  } else {
    const { quotient: fullAmounts, remainder: rest } = getQuotientAndRemainder(
      curAmount,
      maxAmount
    );

    for (let j = 0; j < fullAmounts; j++) {
      dividedAmounts.push(maxAmount);
    }
    dividedAmounts.push(rest);
  }

  return dividedAmounts;
};

const joinSameAmounts = (dividedAmounts) => {
  const joinedAmounts = [];
  const divAmountsLength = dividedAmounts.length;

  let prevAmount = dividedAmounts[0];
  let count = 0;
  for (let i = 1; i < divAmountsLength; i++) {
    const curAmount = dividedAmounts[i];
    if (!curAmount) continue;

    count++;
    if (prevAmount !== curAmount) {
      joinedAmounts.push([prevAmount, count]);
      count = 0;
    }
    prevAmount = curAmount;
  }

  count++;
  if (prevAmount) joinedAmounts.push([prevAmount, count]);

  return joinedAmounts;
};

const prepareAmounts = (dividedAmounts) => {
  const preparedAmounts = [];
  const divAmountsLength = dividedAmounts.length;

  for (let i = 0; i < divAmountsLength; i++) {
    const amount = dividedAmounts[i];

    if (amount) preparedAmounts.push([amount, 1]);
  }

  return preparedAmounts;
};

const getDividedAmounts = (elemsValues, amountsOverride = []) => {
  const { inputs, settings, boxes } = elemsValues;
  const { isNoLimitMaxAmount, isSingleAmounts } = boxes;
  const { absoluteMaxMultiplier, splitHalfMaxMultiplier } = settings;
  let { maxAmount, amount } = inputs;
  maxAmount = isNoLimitMaxAmount ? 1000 : parseFloat(maxAmount);

  const dividedAmounts = [];
  let amounts;
  if (amountsOverride.length) {
    amounts = amount;
  } else {
    amounts = amount.trim().split(" ");
  }

  let prevAmount = null;
  for (let i = 0; i < amounts.length; i++) {
    const curAmount = parseFloat(amounts[i]);
    if (!curAmount || curAmount > 100000) continue;

    if (curAmount > maxAmount) {
      const complexAmounts = getComplexDivisions(
        curAmount,
        maxAmount,
        parseFloat(absoluteMaxMultiplier),
        parseFloat(splitHalfMaxMultiplier)
      );

      dividedAmounts.push(...complexAmounts);
    } else {
      dividedAmounts.push(curAmount);
    }

    prevAmount = curAmount;
  }

  if (!isSingleAmounts) {
    const joinedAmounts = joinSameAmounts(dividedAmounts);
    return joinedAmounts;
  } else {
    const preparedAmounts = prepareAmounts(dividedAmounts);
    return preparedAmounts;
  }
};

module.exports = { getDividedAmounts };
