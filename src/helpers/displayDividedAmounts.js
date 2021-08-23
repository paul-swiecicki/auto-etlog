const { showResultBox } = require("./manageResultBox");

const displayDividedAmounts = (
  dividedAmounts,
  type = "success",
  rawInput = null
) =>
  showResultBox({
    msg: rawInput ? `Zrobione! Ilości: "${rawInput}"` : "Podgląd podziałów:",
    desc: `${dividedAmounts.map((val, i) => {
      const [curAmount, pages] = val;
      return `${i === 0 ? "" : "\n"}${curAmount}*${pages} str`;
    })}`,
    type,
  });

module.exports = {
  displayDividedAmounts,
};
