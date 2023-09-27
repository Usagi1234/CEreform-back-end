/** @format */
var mysql = require('mysql');

//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

async function upload_pdf(fileName, milliseconds, owner, year, type) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO uplondfile (type,fileName , milliseconds , year,owner) VALUES ("${type}","${milliseconds}-${fileName}"  ,NOW(),"${year}","${owner}" )`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Upload successfully');
          resolve(results);
        }
      }
    );
  });
}

async function upload_img(new_name, new_img) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO uplondfile (new_name ,new_img) VALUES ("${new_img}-${new_name}")`,
      function (error, results) {
        if (error) {
          pool.end();
          return resolve({
            statusCode: 500,
            message: `'error SQL Query นาจา! '${error}''`,
          });
        }

        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Upload successfully');
          resolve(results);
        }
      }
    );
  });
}

async function readfile() {
  var Query;
  const pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = 'SELECT * FROM uplondfile WHERE is_deleted = 0';

    console.log('Query is: ', Query);

    pool.query(Query, function (error, results) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (error) {
        console.error('Error retrieving data:', error);
        return reject(error);
      } else {
        console.log('Readfile successful');
        resolve(results);
      }
    });
  });
}

async function pdfdelete(up_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE uplondfile SET is_deleted = 1 WHERE up_id = ${up_id};`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: 'error SQL Query นาจา!',
        });
      }

      pool.end();
      return resolve({
        statusCode: 200,
        message: 'Delete successfully',
        data: results1,
      });
    });
  });
}

// ??? ส่วนที่ทำขึ้นมาใหม่

// อ่านรหัสนักศึกษาจาก id

async function studentCode(stu_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT stu_id FROM student WHERE Id = ${stu_id};`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query ! '${error}''`,
        });
      }

      pool.end();
      resolve(results1[0].stu_id);
    });
  });
}

// อัพโหลดเอกสาร

async function uploadDocument(
  student_id,
  company_id,
  doc_filename,
  doc_filepath,
  doc_semester,
  doc_year,
  doc_type,
  doc_version
) {
  let query;
  let pool = mysql.createPool(config);

  console.log('student_id is: ', student_id);

  return new Promise((resolve, reject) => {
    checkData = `SELECT * FROM documents WHERE student_id = ${student_id} AND doc_type = ${doc_type}`;

    pool.query(checkData, function (error, results, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query ! '${error}''`,
        });
      } else {
        if (results.length > 0) {
          query = `UPDATE documents SET doc_filename = '${doc_filename}', doc_filepath = '${doc_filepath}', doc_semester = '${doc_semester}', doc_year = '${doc_year}', doc_type = '${doc_type}', doc_version = '${doc_version}', company_id = '${company_id}' WHERE student_id = '${student_id}' AND doc_type = '${doc_type}'`;
        } else {
          query = `INSERT INTO documents (student_id, company_id, doc_filename, doc_filepath, doc_semester, doc_year, doc_type, doc_version) VALUES ('${student_id}', '${company_id}', '${doc_filename}', '${doc_filepath}', '${doc_semester}', '${doc_year}', '${doc_type}', '${doc_version}')`;
        }

        console.log('Query is: ', query);

        pool.query(query, function (error, results, fields) {
          if (error) {
            pool.end();
            return resolve({
              statusCode: 500,
              message: `'error SQL Query ! '${error}''`,
            });
          }

          pool.end();
          return resolve({
            statusCode: 200,
            message: 'Upload successfully',
            results: results,
          });
        });
      }
    });
  });
}

// เช็ค ปี/เทอม การศึกษาล่าสุด
async function checkLastSemester() {
  let query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    query = `SELECT * FROM latest_semester_year ORDER BY lsy_year DESC, lsy_semester DESC LIMIT 1`;

    console.log('Query is: ', query);

    pool.query(query, function (error, results, fields) {
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
          results: results,
        });
      }
    });
  });
}

async function getFileStudent(student_id) {
  let query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    query = `SELECT * FROM documents WHERE student_id = '${student_id}'`;

    console.log('Query is: ', query);

    pool.query(query, function (error, results, fields) {
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

async function getAllSemesterYear() {
  let query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    query = `SELECT * FROM latest_semester_year ORDER BY lsy_year DESC, lsy_semester DESC`;

    console.log('Query is: ', query);

    pool.query(query, function (error, results, fields) {
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
          results: results,
        });
      }
    });
  });
}

async function uploadDocumentTeacher(
  student_id,
  doc_filename,
  doc_filepath,
  doc_type,
  doc_version
) {
  let query;
  let pool = mysql.createPool(config);

  console.log('student_id is: ', student_id);

  return new Promise((resolve, reject) => {
    query = `update documents set doc_filename = '${doc_filename}', doc_filepath = '${doc_filepath}', doc_version = '${doc_version}' where student_id = '${student_id}' and doc_type = '${doc_type}'`;

    console.log('Query is: ', query);

    pool.query(query, function (error, results, fields) {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query ! '${error}''`,
        });
      }

      pool.end();
      return resolve({
        statusCode: 200,
        message: 'Upload successfully',
        results: results,
      });
    });
  });
}

async function getFileCompanyForOfficer() {
  let query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    query = `SELECT * FROM acceptance_document
INNER JOIN company ON company.com_id = acceptance_document.company_id
WHERE acceptance_document.is_deleted = 0`;

    console.log('Query is: ', query);

    pool.query(query, function (error, results, fields) {
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

module.exports.uploadFile = {
  upload_pdf: upload_pdf,
  read_file: readfile,
  pdfdelete: pdfdelete,
  upload_img: upload_img,
  studentCode: studentCode,
  // !!! ส่วนที่ทำขึ้นมาใหม่
  uploadDocument: uploadDocument,
  checkLastSemester: checkLastSemester,
  getFileStudent: getFileStudent,
  getAllSemesterYear: getAllSemesterYear,
  uploadDocumentTeacher: uploadDocumentTeacher,
  getFileCompanyForOfficer: getFileCompanyForOfficer,
};
