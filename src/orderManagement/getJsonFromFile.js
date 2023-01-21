const XLSX = require("xlsx");
const { showResultBox } = require("../helpers/manageResultBox");

const getHeaders = (workbook, headersRow) => {
  var sheet_name_list = workbook.SheetNames;
  let columnHeaders = [];
  for (var sheetIndex = 0; sheetIndex < sheet_name_list.length; sheetIndex++) {
    var worksheet = workbook.Sheets[sheet_name_list[sheetIndex]];
    for (let key in worksheet) {
      let regEx = new RegExp(`^(\\w)(${headersRow}){1}$`);
      if (regEx.test(key) == true) {
        columnHeaders.push(worksheet[key].v);
      }
    }
  }
  return columnHeaders;
};

function getJsonFromFile(input, headersIds) {
  return new Promise((resolve, reject) => {
    var files = input.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });

      const headers = getHeaders(workbook, headersIds.row);

      var sheet = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        {
          header: headers,
          defval: null,
        }
      );

      resolve({ sheet, headers });
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
