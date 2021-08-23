const { windowManager } = require("node-window-manager");

/**
 * @param {string} regEx
 * @returns first window found by regex match
 */
const getWindow = (regEx) => {
  const windows = windowManager.getWindows();
  if (!windows.length) return null;

  for (let i = 0; i < windows.length; i++) {
    const window = windows[i];
    const windowTitle = window.getTitle();
    const regExObj = new RegExp(regEx, "i");
    const matchResult = windowTitle.match(regExObj);

    if (matchResult) return window;
  }
  return null;
};

module.exports = {
  getWindow,
};
