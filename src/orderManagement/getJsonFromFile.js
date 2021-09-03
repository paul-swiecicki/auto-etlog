const XLSX = require("xlsx");
const { showResultBox } = require("../helpers/manageResultBox");

function getJsonFromFile(input, headers) {
  return new Promise((resolve, reject) => {
    var files = input.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });

      var jsonOrder = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        {
          header: headers,
          defval: null,
        }
      );

      resolve(jsonOrder);
    };
    try {
      reader.readAsArrayBuffer(f);
    } catch (error) {
      showResultBox({
        msg: "Wystąpił błąd podczas odczytywania danych z pliku",
        desc: "Sprawdź czy wybrałeś odpowiednie pliki w formacie .xlsx",
        type: "error",
      });
      console.log(error);
      reject(error);
    }
  });
}

module.exports = {
  getJsonFromFile,
};
