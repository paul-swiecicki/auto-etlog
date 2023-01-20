const { getNudgeX, getNudgeY } = require("../helpers/getNudge");

const leftEdgeX = (x, bounds) => {
  return bounds.x + x + getNudgeX();
};
const topEdgeY = (y, bounds) => {
  return bounds.y + y + getNudgeY();
};

const rightEdgeX = (x, bounds) => {
  const winBottomX = bounds.x + bounds.width;
  return winBottomX - x + getNudgeX();
};
const bottomEdgeY = (y, bounds) => {
  const winBottomY = bounds.y + bounds.height;
  return winBottomY - y + getNudgeY();
};

module.exports = { leftEdgeX, topEdgeY, rightEdgeX, bottomEdgeY };
