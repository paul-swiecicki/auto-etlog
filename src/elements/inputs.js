const { getElementsById } = require("../utils/getElementsById");

const inputs = getElementsById([
  "ssccAmount",
  "additionalText",
  "amount",
  "maxAmount",
]);

const fileInputs = getElementsById(["orderFile", "productsFile"], false);

const settingsInputs = getElementsById([
  "additionalClickWaitTime",
  "printWindowLoadTime",
  "nudgeX",
  "nudgeY",
  "absoluteMaxMultiplier",
  "splitHalfMaxMultiplier",
  "generatingWindowName",
  "printingWindowName",
]);

const capsTest = document.getElementById("capsTest");

module.exports = {
  inputs,
  settingsInputs,
  fileInputs,
  capsTest,
};
