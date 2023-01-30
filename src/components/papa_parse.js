import Papa from "papaparse";

export const papaparseData = (setData, fileRoute) => {
  const parseFile = (file) => {
    Papa.parse(file, {
      delimiter: ",",
      linebreak: "\r\n",
      encoding: "UTF-8",
      header: false,
      download: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  parseFile(fileRoute);
};
