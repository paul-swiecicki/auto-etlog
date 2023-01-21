const ioHook = require("iohook");

let isEscaped = false;
const getEscaped = () => {
  return isEscaped;
};

let escDetectorInterval = null;
const escDetector = () => {
  return new Promise((resolve, reject) => {
    escDetectorInterval = setInterval(() => {
      if (getEscaped()) {
        isEscaped = false;
        resolve("esc");
      }
    }, 100);
  });
};

const clearEscDetector = () => {
  if (escDetectorInterval) clearInterval(escDetectorInterval);
};

ioHook.on("keypress", (e) => {
  if (e.keychar === 99 && e.ctrlKey) {
    isEscaped = true;
  }
});
ioHook.start();

module.exports = { escDetector, clearEscDetector };
