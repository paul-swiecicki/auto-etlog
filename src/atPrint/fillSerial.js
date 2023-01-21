const robot = require("robotjs");
const { getDateArray } = require("../utils/getDateArray");

const fillSerial = (date) => {
  const dateArray = getDateArray(date);
  const joinedDate = dateArray.reduce((prev, cur) => {
    return prev + cur;
  }, "");
  const serial = `${joinedDate}/EP`;
  robot.typeString(serial);
};

module.exports = { fillSerial };
