var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

async function getcompanys() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM company WHERE is_deleted = 0`;

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
          message: 'Do not have any Company!',
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- เพิ่มข้อมูลนักศึกษา ----------------------------------------------------------------------------------//

async function companyinsert(com_name, com_type, com_add, com_province, com_contact, user, pass) {
  if (!com_name || !com_type || !com_add || !com_province || !com_contact || !user || !pass) {
    return {
      statusCode: 400,
      message: 'ข้อมูลไม่ครบจ้า',
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO company (com_name, com_type, com_add, com_province, com_contact , user,pass)
                        VALUES ('${com_name}', '${com_type}', '${com_add}', '${com_province}', '${com_contact}','${user}' ,'${pass}');`;

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
          message: `Successfully added company with name '${com_name}'`,
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- แก้ไขข้อมูลสถานประกอบการ ----------------------------------------------------------------------------------//

async function companyupdate(com_id, com_name, com_type, com_add, com_province, com_contact, user, pass) {
  if (!com_id || !com_name || !com_type || !com_add || !com_province || !com_contact || !user || !pass) {
    return {
      statusCode: 400,
      message: 'ข้อมูลไม่ครบจ้า',
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE company SET com_name = '${com_name}' , com_type = '${com_type}' , com_add = '${com_add}' , com_province = '${com_province}', com_contact = '${com_contact}', user = '${user}' , pass = '${pass}' WHERE com_id = ${com_id}`;

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
        message: `Update company ${com_name} Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}

//---------------------------------------------------------------------------------- ลบข้อมูลนักศึกษา ----------------------------------------------------------------------------------//

async function compantdelete(com_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE company SET is_deleted = 1 WHERE com_id = ${com_id};`;

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

async function company(com_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM company WHERE com_id = ${com_id}`;

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
        message: 'Select successfully',
        results: results1,
      });
    });
  });
}

async function getFileCompany(com_id) {
  let Query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM acceptance_document WHERE company_id = ${com_id} ORDER BY updated_at DESC`;

    console.log('Query is: ', Query);

    pool.query(Query, function (error, results, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query ! '${error}''`,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          message: 'Select successfully',
          data: results,
        });
      }
    });
  });
}

async function sendFileCompany(company_id, ad_filename, ad_filepath) {
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO acceptance_document (company_id, ad_filename, ad_filepath) VALUES (?, ?, ?)';
    const values = [company_id, ad_filename, ad_filepath];

    pool.query(query, values, (error, results) => {
      if (error) {
        return resolve({
          statusCode: 500,
          message: `SQL Query error: ${error}`,
        });
      }
      return resolve({
        statusCode: 200,
        message: 'Insert successfully',
        data: results,
      });
    });
  });
}

async function getCompanyByID(com_id) {
  let Query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM company WHERE com_id = ${com_id}`;

    console.log('Query is: ', Query);

    pool.query(Query, function (error, results, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query ! '${error}''`,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          message: 'Select successfully',
          data: results,
        });
      }
    });
  });
}

module.exports.CompanyRepo = {
  getcompanys: getcompanys,
  companyinsert: companyinsert,
  companyupdate: companyupdate,
  compantdelete: compantdelete,
  company: company,
  getFileCompany: getFileCompany,
  sendFileCompany: sendFileCompany,
  getCompanyByID: getCompanyByID,
};
