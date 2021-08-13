const robot = require("robotjs");

// const atPrintFillDate = (date) => {
//   const dateArray = getDateArray(date);
//   console.log("date:", dateArray);
//   dateArray.forEach((datePart) => {
//     robot.typeString(datePart);
//     robot.keyTap("right");
//   });
// };

const fillSerial = (date) => {
  // moveMouseRelToWindow(226, 233, bounds);
  // robot.mouseClick();

  const dateArray = getDateArray(date);
  console.log("serial", dateArray);
  const joinedDate = dateArray.reduce((prev, cur) => {
    return prev + cur;
  }, "");
  const serial = `${joinedDate}/EP`;
  console.log(joinedDate, dateArray, serial);
  robot.typeString(serial);
};

module.exports = { fillSerial };
