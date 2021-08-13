const ioHook = require("iohook");

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

module.exports = { escDetector };
