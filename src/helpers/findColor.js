const findColor = ({ bitmap, colors }) => {
  for (let i = 0; i < bitmap.width; i++) {
    for (let j = 0; j < bitmap.height; j++) {
      const pixelColor = bitmap.colorAt(i, j);
      if (colors.includes(pixelColor)) return { x: i, y: j };
    }
  }

  return null;
};

module.exports = {
  findColor,
};
