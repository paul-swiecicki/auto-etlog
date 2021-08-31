const XLSX = require("xlsx");

function getOrder(input, headers) {
  return new Promise((resolve, reject) => {
    console.log(input);
    var files = input.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });

      var jsonOrder = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        {
          header: [headers.product, ...headers.amounts],
        }
      );

      resolve(jsonOrder);
    };
    reader.readAsArrayBuffer(f);
  });
}

module.exports = {
  getOrder,
};
