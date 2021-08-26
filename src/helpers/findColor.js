const findColor = ({ bitmap, colors }) => {
  for (let i = 0; i < bitmap.width; i++) {
    for (let j = 0; j < bitmap.height; j++) {
      const pixelColor = bitmap.colorAt(i, j);
      console.log({ x: i, y: j, pixelColor });
      if (colors.includes(pixelColor)) return { x: i, y: j };
    }
  }
  console.log(colors);
  return null;
};

module.exports = {
  findColor,
};
