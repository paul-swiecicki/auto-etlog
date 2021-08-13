const { windowManager } = require("node-window-manager");

/**
 * @param {string} title
 * @returns first window found by regex match
 */
const getWindow = (title) => {
  const windows = windowManager.getWindows();
  if (!windows.length) return null;

  for (let i = 0; i < windows.length; i++) {
    const window = windows[i];
    const windowTitle = window.getTitle();
    const regex = new RegExp(`^${title}`, "i");
    const matchResult = windowTitle.match(regex);

    if (matchResult) return window;
  }
  return null;
};

module.exports = {
  getWindow,
};
