let nudgeXInput, nudgeYInput;
window.addEventListener("DOMContentLoaded", () => {
  nudgeXInput = document.getElementById("nudgeX");
  nudgeYInput = document.getElementById("nudgeY");
});

const getNudgeX = () => {
  if (!nudgeXInput) return 0;
  const nudgeX = parseInt(nudgeXInput.value);
  return nudgeX;
};
const getNudgeY = () => {
  if (!nudgeYInput) return 0;

  const nudgeY = parseInt(nudgeYInput.value);
  return nudgeY;
};

module.exports = {
  getNudgeX,
  getNudgeY,
};
