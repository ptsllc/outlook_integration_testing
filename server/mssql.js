const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require("tedious").TYPES;
const { db_config } = require("./appConfig");

function query(myQuery, params = [], isStoredProc = false) {
  var connection = new Connection(db_config);
  connection.connect();

  return new Promise(function (resolve, reject) {
    connection.on("connect", function (err) {
      if (err) {
        console.log(err);
      } else {
        // Setup the request
        let request = new Request(myQuery, function (err, rowCount) {
          if (err) {
            reject(err);
          }
          connection.close();
        });

        // Bring in any parameters
        params.forEach((param) => {
          request.addParameter(param.name, param.type, param.value);
        });

        // Handle the data returned from the DB
        let dataset = [];
        request.on("row", function (columns) {
          let row = {};
          columns.forEach(function (column) {
            row[column.metadata.colName] = column.value;
          });
          dataset.push(row);
        });

        // Handle the completion event
        request.on("doneProc", function () {
          rtn = {};
          rtn["data"] = dataset;
          resolve(rtn);
        });

        // Execute the query
        if (isStoredProc) {
          connection.callProcedure(request);
        } else {
          connection.execSql(request);
        }
      }
    });
  });
}

function createParam(name, value) {
  let paramType = "";
  if (typeof value.getMonth === "function") {
    paramType = TYPES.Date;
  } else if (typeof value === "string") {
    paramType = TYPES.VarChar;
  } else if (typeof value === "number") {
    paramType = TYPES.Int;
  }

  return {
    name: name,
    type: paramType,
    value: value,
  };
}

module.exports = {
  query,
  createParam,
};
