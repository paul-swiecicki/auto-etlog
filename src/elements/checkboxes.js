const { getElementsById } = require("../utils/getElementsById");

const checkboxesIds = [
  "isDateInput",
  "doValidate",
  "noLimitMaxAmount",
  "isSingleAmounts",
  "dividedAmountsPeek",
];

const settingsCheckboxes = getElementsById(checkboxesIds, false);

module.exports = {
  settingsCheckboxes,
  checkboxesIds,
};
