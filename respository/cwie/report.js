/** @format */
var mysql = require('mysql');

//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

async function getreport() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT *
                FROM reportday
                INNER JOIN company ON company.com_id = reportday.com_id
                INNER JOIN student ON student.Id = reportday.Id
                WHERE reportday.is_deleted = 0`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (results1.length > 0) {
        //results = ผลลัพธ์
        pool.end();
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 500,
          message: 'Do not have any Report!',
        });
      }
    });
  });
}

async function insertreport(re_hname, re_week, re_details, Id, com_id) {
  var Query;
  var pool = mysql.createPool(config);

  console.log(Id);
  return new Promise((resolve, reject) => {
    Query = `INSERT INTO reportday (re_hname, re_week, re_details, Id, com_id)
                 VALUES ('${re_hname}', '${re_week}', '${re_details}', '${Id}', '${com_id}')
                `;

    console.log('Query2 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (results1.length > 0) {
        //results = ผลลัพธ์
        pool.end();
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          message: `Successfully added reprot '${re_hname}'`,
        });
      }
    });
  });
}

async function updatereport(re_id, re_hname, re_week, re_details, Id, com_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE reportday SET re_hname = '${re_hname}', re_week = '${re_week}', re_details = '${re_details}' ,
                     Id = '${Id}', com_id = '${com_id}'
                    WHERE re_id = ${re_id}`;

    //throw = เป็นคำสั่งที่ทำให้เซิฟเวอร์ดับ  = ไม่ค่อยแนะนำ

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Insert Student ${Id} Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}

async function deletereport(re_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE reportday SET is_deleted = 1 WHERE re_id = ${re_id};`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      pool.end();
      return resolve({
        statusCode: 200,
        message: 'Delete successfully',
        results: results1,
      });
    });
  });
}

async function getnews() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM news WHERE is_deleted = 0`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (results1.length > 0) {
        //results = ผลลัพธ์
        pool.end();
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 500,
          message: 'Do not have any news!',
        });
      }
    });
  });
}

async function insertnew(new_name, new_img, new_details) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO news (new_name, new_img, new_details)
                 VALUES ('${new_name}', '${new_img}', '${new_details}')
                `;
    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (results1.length > 0) {
        //results = ผลลัพธ์
        pool.end();
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          message: `Successfully added new '${new_name}'`,
        });
      }
    });
  });
}

async function deletenew(new_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE news SET is_deleted = 1 WHERE new_id = ${new_id};`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      pool.end();
      return resolve({
        statusCode: 200,
        message: 'Delete successfully',
        results: results1,
      });
    });
  });
}

async function getstatus() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM status WHERE is_deleted = 0`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (results1.length > 0) {
        //results = ผลลัพธ์
        pool.end();
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          message: 'Do not have any status!',
        });
      }
    });
  });
}

module.exports.ReposrtRepo = {
  getreport: getreport,
  getnews: getnews,
  insertreport: insertreport,
  updatereport: updatereport,
  deletereport: deletereport,
  getstatus: getstatus,
  insertnew: insertnew,
  deletenew: deletenew,
};
