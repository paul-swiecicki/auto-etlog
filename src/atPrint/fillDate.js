const robot = require("robotjs");

const fillDate = (date) => {
  const today = new Date().toISOString().split("T")[0];
  if (date === today) return;

  const dateArr = date.split("-").reverse();
  const dateLen = dateArr.length;

  for (let i = 0; i < dateLen; i++) {
    const datePart = dateArr[i];

    robot.typeString(datePart);
    robot.keyTap("right");
  }
};

module.exports = {
  fillDate,
};
