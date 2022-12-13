const mysql = require("mysql2");
const con = mysql.createConnection({
  database: "iotapp",
  host: "localhost",
  user: "root",
  password: "0000", 
});

async function getTableResults(table) {
  const [res] = await con.promise().query(`SELECT * FROM ${table}`);
  return res;
}
async function getByDates(startDate, endDate,table) {
  var sql = `SELECT * FROM ${table} where
    (date BETWEEN '${startDate}'AND '${endDate}')`;
  const [res] = await con.promise().query(sql);
  return res;
}
module.exports = {
  getTableResults,
  getByDates,
};
