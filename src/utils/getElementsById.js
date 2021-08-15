const getElementsById = (ids = []) => {
  return ids.reduce((acc, cur) => {
    acc[cur] = document.getElementById(cur);
    return acc;
  }, {});
};

module.exports = { getElementsById };
