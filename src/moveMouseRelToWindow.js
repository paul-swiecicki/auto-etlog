const robot = require("robotjs");

const moveMouseRelToWindow = (
  x = 0,
  y = 0,
  bounds = { x: 0, y: 0, width: 500, height: 500 },
  relToBottom = false
) => {
  if (!bounds) throw new Error("window bounds not passed");
  const winX = bounds.x + x;
  let winY = bounds.y + y;
  if (relToBottom) {
    const winBottomY = bounds.y + bounds.height;
    winY = winBottomY - y;
  }
  robot.moveMouse(winX, winY);
};

module.exports = {
  moveMouseRelToWindow,
};
