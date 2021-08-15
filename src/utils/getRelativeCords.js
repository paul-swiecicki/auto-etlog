const leftEdgeX = (x, bounds) => {
  return bounds.x + x;
};
const topEdgeY = (y, bounds) => {
  return bounds.y + y;
};

const rightEdgeX = (x, bounds) => {
  const winBottomX = bounds.x + bounds.width;
  return winBottomX - x;
};
const bottomEdgeY = (y, bounds) => {
  const winBottomY = bounds.y + bounds.height;
  return winBottomY - y;
};

module.exports = { leftEdgeX, topEdgeY, rightEdgeX, bottomEdgeY };
