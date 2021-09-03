const getInnerWindow = (fullTitle, innerWindow) => {
  const regExObj = new RegExp(`etlog \\(.+\\) - \\[${innerWindow}`, "i");
  const matchResult = fullTitle.match(regExObj);
  return matchResult;
};

module.exports = {
  getInnerWindow,
};
