const logColor = (pixelColor) => {
  console.log(`%c ${pixelColor}`, `color: white; background: #${pixelColor}`);
};

module.exports = {
  logColor,
};
