// const nodeAbi = require("node-abi");

const { getWindow } = require("./utils/getWindow");
const { escDetector } = require("./utils/escDetector");
const { fillTextInputs } = require("./atPrint/fillTextInputs");
const { replaceAmount } = require("./atPrint/replaceAmount");
const { clickPrintBtns, clickCloseBtn } = require("./atPrint/clickBtns");
// console.log(nodeAbi.getAbi("12.0.15", "electron"));

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

  const settingsInputs = {
    btnsGenTime: document.getElementById("btnsGenTime"),
    isBiedronka: document.getElementById("isBiedronka"),
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
    if (!ssccAmount || !additionalText || !amount)
      return alert("Wypełnij wszystkie wymagane pola!");

    const btnsGenTime = settingsInputs.btnsGenTime.value;

    const amounts = amount.trim().split(" ");
    const dividedAmounts = [];

    for (let i = 0; i < amounts.length; i++) {
      const curAmount = amounts[i];
      if (!curAmount) continue;

      if (curAmount > maxAmount) {
        const fullAmounts = Math.floor(curAmount / maxAmount);
        const rest = curAmount % maxAmount;

        for (let j = 0; j < fullAmounts; j++) {
          dividedAmounts.push(maxAmount);
        }
        dividedAmounts.push(rest);
      } else {
        dividedAmounts.push(curAmount);
      }
    }

    const isBiedronka = settingsInputs.isBiedronka.checked;
    console.log({ isBiedronka });
    fillTextInputs({
      ssccAmount: ssccAmount,
      additionalText: additionalText,
      amount: dividedAmounts[0],
      bounds,
      isBiedronka,
    });
    await clickPrintBtns(bounds, btnsGenTime);

    let prevAmount;
    for (let i = 1; i < dividedAmounts.length; i++) {
      const curAmount = dividedAmounts[i];
      console.log({ curAmount, prevAmount });

      if (curAmount !== prevAmount) replaceAmount(curAmount, bounds);

      await clickPrintBtns(bounds, btnsGenTime);
      prevAmount = curAmount;
    }
    clickCloseBtn(bounds);
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
