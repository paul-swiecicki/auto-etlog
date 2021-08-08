const { getWindow } = require("./getWindow");
const robot = require("robotjs");
const { moveMouseRelToWindow } = require("./moveMouseRelToWindow");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const logColor = (pixelColor) => {
  console.log(`%c ${pixelColor}`, `color: white; background: #${pixelColor}`);
};

const findColorAndLog = ({ bitmap, width, height, color, pixelsAmount }) => {
  for (let i = 0; i < width - 1; i++) {
    for (let j = 0; j < height - 1; j++) {
      const pixelColor = bitmap.colorAt(i, j);

      if (pixelColor === color) return { i, j };

      // if (j === 300) return j;
    }
  }
  return null;
};

const getAndPrepareEtlogWindow = () => {
  const window = getWindow("etlog");
  window.bringToTop();
  const bounds = window.getBounds();
  // console.log(bounds);
  // const bitmap = robot.screen.capture(bounds.x, bounds.y, 350, bounds.height);
  return bounds;
};

const atPrintFillTextInputs = ({
  ssccAmount = 1,
  additionalText = "A 01",
  amount = 1,
  bounds,
}) => {
  moveMouseRelToWindow(220, 100, bounds);
  robot.mouseClick();
  robot.keyTap("backspace");
  robot.typeString(ssccAmount);
  robot.keyTap("tab");
  robot.keyTap("tab");
  robot.typeString(additionalText);
  robot.keyTap("tab");
  robot.keyTap("delete");
  robot.typeString(amount);
};

const atPrintClickPrintBtns = async (bounds, printWaitTime = 2000) => {
  moveMouseRelToWindow(200, 180, bounds, true);
  robot.mouseClick();
  await sleep(printWaitTime);
  moveMouseRelToWindow(120, 70, bounds, true);
  // moveMouseRelToWindow(250, 70, bounds, true);
  robot.mouseClick();
};

const DOMLoaded = () => {
  const findBtn = document.getElementById("find");
  const getColorBtn = document.getElementById("getColor");

  findBtn.addEventListener("click", () => {
    const window = getWindow("etlog");
    // window.bringToTop();
    const bounds = window.getBounds();
    console.log(bounds);
    const bitmap = robot.screen.capture(bounds.x, bounds.y, 350, bounds.height);

    const pos = findColorAndLog({
      bitmap,
      width: bounds.width,
      height: bounds.height,
      color: "360036",
      pixelsAmount: 5,
    });

    console.log(pos);
  });

  getColorBtn.addEventListener("click", () => {
    setInterval(() => {
      const cords = robot.getMousePos();
      console.log(cords);
      const bitmap = robot.screen.capture(cords.x, cords.y, 10, 10);

      const pixelColor = bitmap.colorAt(0, 0);
      logColor(pixelColor);
    }, 1000);
  });

  const autoPrint = document.getElementById("print"),
    ssccAmountInput = document.getElementById("ssccAmount");
  additionalTextInput = document.getElementById("additionalText");
  amountInput = document.getElementById("amount");

  autoPrint.addEventListener("click", () => {
    const bounds = getAndPrepareEtlogWindow();
    const ssccAmount = ssccAmountInput.value;
    const additionalText = additionalTextInput.value;
    const amount = amountInput.value;
    if (!ssccAmount) return alert("Wypełnij wszystkie pola!");

    atPrintFillTextInputs({
      ssccAmount,
      additionalText,
      amount,
      bounds,
    });
    atPrintClickPrintBtns(bounds);
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
