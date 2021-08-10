const robot = require("robotjs");
// const nodeAbi = require("node-abi");
const ioHook = require("iohook");
const { getWindow } = require("./getWindow");
const { moveMouseRelToWindow } = require("./moveMouseRelToWindow");
const iohook = require("iohook");

// console.log(nodeAbi.getAbi("12.0.15", "electron"));
let isEscaped = false;
const getEscaped = () => {
  return isEscaped;
};

let escDetectorInterval = null;
const escDetector = () => {
  if (escDetectorInterval) clearInterval(escDetectorInterval);
  return new Promise((resolve, reject) => {
    escDetectorInterval = setInterval(() => {
      if (getEscaped()) {
        isEscaped = false;
        resolve("esc");
      }
    }, 100);
  });
};

ioHook.on("keypress", (e) => {
  if (e.keychar === 99 && e.ctrlKey) {
    isEscaped = true;
  }
  // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
});
ioHook.start();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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

const atPrintReplaceAmount = (amount = 1, bounds) => {
  moveMouseRelToWindow(300, 230, bounds);
  robot.mouseClick("left", true);
  robot.keyTap("backspace");
  robot.typeString(amount);
};

const atPrintClickPrintBtns = async (bounds, btnClickWaitTime = 2300) => {
  moveMouseRelToWindow(200, 180, bounds, true);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
  moveMouseRelToWindow(120, 70, bounds, true);
  robot.mouseClick();
  await sleep(btnClickWaitTime);
};

const atPrintClickCloseBtn = (bounds) => {
  moveMouseRelToWindow(250, 70, bounds, true);
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

  const autoPrint = document.getElementById("print");
  const inputs = {
    ssccAmount: document.getElementById("ssccAmount"),
    additionalText: document.getElementById("additionalText"),
    amount: document.getElementById("amount"),
    maxAmount: document.getElementById("maxAmount"),
  };

  autoPrint.addEventListener("click", async () => {
    escDetector().then(() => {
      process.exit();
    });

    const bounds = getAndPrepareEtlogWindow();
    const ssccAmount = inputs.ssccAmount.value;
    const additionalText = inputs.additionalText.value;
    const amount = inputs.amount.value;
    const maxAmount = inputs.maxAmount.value;
    if (!ssccAmount) return alert("Wypełnij wszystkie pola!");

    const amounts = amount.trim().split(" ");
    console.log(amounts);

    if (getEscaped()) return;
    atPrintFillTextInputs({
      ssccAmount: ssccAmount,
      additionalText: additionalText,
      amount: amounts[0],
      bounds,
    });
    if (getEscaped()) return;
    await atPrintClickPrintBtns(bounds, 2000);
    if (getEscaped()) return;

    for (let i = 1; i < amounts.length; i++) {
      if (getEscaped()) return;
      const currentAmount = amounts[i];

      atPrintReplaceAmount(currentAmount, bounds);
      // await sleep(1000);
      await atPrintClickPrintBtns(bounds);
    }

    if (getEscaped()) return;
    atPrintClickCloseBtn(bounds);

    if (getEscaped()) return;
    revertEscaped();
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
