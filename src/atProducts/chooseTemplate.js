const robot = require("robotjs");
const { moveMouseRelToWindow } = require("../utils/moveMouseRelToWindow");
const { sleep } = require("../utils/sleep");

const selectTemplateByNumFromBottom = (nr, bounds) => {
  const firstTempPos = 42;
  const templateElementHeight = 27;

  const templateY = firstTempPos + templateElementHeight * (nr - 1);
  moveMouseRelToWindow(360, templateY, bounds, ["bottom"]);
  robot.mouseClick();
};

const templatesForUnits = {
  kg: 2,
  szt: 1,
  default: 2,
};

// open template list
const chooseTemplate = async (unit, bounds) => {
  moveMouseRelToWindow(360, 15, bounds, ["bottom"]);
  robot.mouseClick();
  await sleep(1000);

  const templateNum = templatesForUnits[unit] || templatesForUnits["default"];
  selectTemplateByNumFromBottom(templateNum, bounds);
  await sleep(1000);
};

module.exports = {
  chooseTemplate,
};
