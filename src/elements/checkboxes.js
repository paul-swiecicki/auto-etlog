const { getElementsById } = require("../utils/getElementsById");

const checkboxesIds = [
  "isDateInput",
  "doValidate",
  "isNoLimitMaxAmount",
  "isSingleAmounts",
  "dividedAmountsPeek",
  "validateWindowTitle",
];

const settingsCheckboxes = getElementsById(checkboxesIds, false);

module.exports = {
  settingsCheckboxes,
  checkboxesIds,
};
