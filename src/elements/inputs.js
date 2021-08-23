const { getElementsById } = require("../utils/getElementsById");

const inputs = getElementsById([
  "ssccAmount",
  "additionalText",
  "amount",
  "maxAmount",
]);

const settingsInputs = getElementsById([
  "btnsGenTime",
  "printWindowLoadTime",
  "nudgeX",
  "nudgeY",
  "anotherPageWaitPercent",
  "absoluteMaxMultiplier",
  "splitHalfMaxMultiplier",
]);

module.exports = {
  inputs,
  settingsInputs,
};
