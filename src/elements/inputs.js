const { getElementsById } = require("../utils/getElementsById");

const inputs = getElementsById([
  "ssccAmount",
  "additionalText",
  "amount",
  "maxAmount",
]);
const packDate = document.getElementById("packDate");
inputs.packDate = packDate;
packDate.valueAsDate = new Date();

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

  "headerRowNum",
  "productCol",
  "firstAmountCol",
  "lastAmountCol",
]);

const capsTest = document.getElementById("capsTest");

module.exports = {
  inputs,
  settingsInputs,
  fileInputs,
  capsTest,
};
