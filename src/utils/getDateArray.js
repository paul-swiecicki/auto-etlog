/**
 *
 * @param {?string} date
 * @returns
 */
const getDateArray = (date) => {
  let dateArray = [];
  console.log(date);

  if (!date) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 1);

    const day = ("0" + dateObj.getDate()).slice(-2);
    const month = ("0" + dateObj.getMonth() + 1).slice(-2);
    const year = dateObj.getFullYear().toString().slice(2);
    console.log(year);
    dateArray = [day, month, year];
  } else {
    dateArray = date.split(".");
  }
  return dateArray;
};

module.exports = { getDateArray };
