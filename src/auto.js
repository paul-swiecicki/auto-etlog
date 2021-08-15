// const nodeAbi = require("node-abi");
const robot = require("robotjs");

const { getWindow } = require("./utils/getWindow");
const { escDetector } = require("./helpers/escDetector");
const { fillTextInputs } = require("./atPrint/fillTextInputs");
const { replaceAmount } = require("./atPrint/replaceAmount");
const { clickPrintBtns, clickCloseBtn } = require("./atPrint/clickBtns");
const { moveMouseRelToWindow } = require("./utils/moveMouseRelToWindow");
const atProducts = require("./atProducts");
const { getDividedAmounts } = require("./helpers/getDividedAmounts");
const { hideResultBox, showResultBox } = require("./helpers/manageResultBox");
const { getElementsById } = require("./utils/getElementsById");
const { getElementsValues } = require("./utils/getElementsValues");

const logColor = (pixelColor) => {
  console.log(`%c ${pixelColor}`, `color: white; background: #${pixelColor}`);
};

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

const getAndPrepareEtlogWindow = () => {
  const window = getWindow("etlog");
  window.bringToTop();
  return window;
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

  // todo get color where 'nazwa' is (if white) then its product page

  const autoPrint = document.getElementById("print");

  const inputs = getElementsById([
    "ssccAmount",
    "additionalText",
    "amount",
    "maxAmount",
  ]);

  const settingsInputs = getElementsById([
    "btnsGenTime",
    "isDateInput",
    "printWindowLoadTime",
  ]);

  autoPrint.addEventListener("click", async (e) => {
    e.preventDefault();

    hideResultBox();

    const colorForValidation = robot.getPixelColor(260, 70);
    console.log(colorForValidation);

    escDetector().then(() => {
      process.exit();
    });

    const etlogWindow = getAndPrepareEtlogWindow();
    const bounds = etlogWindow.getBounds();

    const inputsValues = getElementsValues(inputs);
    const settingsValues = getElementsValues(settingsInputs);

    const dividedAmounts = getDividedAmounts(inputsValues);

    const isDateInput = settingsInputs.isDateInput.checked;

    try {
      await atProducts.clickPrintBtn(
        bounds,
        settingsValues.printWindowLoadTime
      );
    } catch (err) {
      if (err.message === atProducts.windowTooSmallError)
        return showResultBox({
          msg: 'Okno EtLog jest zbyt małe aby było możliwe kliknięcie przycisku "drukuj".',
          desc: "Powiększ okno i spróbuj ponownie.",
          type: "error",
        });
    }

    fillTextInputs({
      ssccAmount: inputsValues.ssccAmount,
      additionalText: inputsValues.additionalText,
      amount: dividedAmounts[0],
      bounds,
      isDateInput,
    });
    await clickPrintBtns(bounds, settingsValues.btnsGenTime);

    let prevAmount;
    for (let i = 1; i < dividedAmounts.length; i++) {
      const curAmount = dividedAmounts[i];
      console.log({ curAmount, prevAmount });

      if (curAmount !== prevAmount) replaceAmount(curAmount, bounds);

      await clickPrintBtns(bounds, settingsValues.btnsGenTime);
      prevAmount = curAmount;
    }
    clickCloseBtn(bounds);

    showResultBox({
      msg: `Zrobione! Ilości: "${inputsValues.amount}"`,
      desc: `Podzielone na (${dividedAmounts})`,
    });
  });
};

window.addEventListener("DOMContentLoaded", DOMLoaded);
