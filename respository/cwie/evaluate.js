/** @format */
var mysql = require('mysql');

//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

// ? ---------------------------------------------- ประเมินสถานประกอบการ (อาจารย์ประเมินสถานประกอบการ) ----------------------------------------------//

async function getevaluate() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = ` SELECT *
              FROM answer_teacher_com 
              LEFT JOIN evaluate_company 
              ON answer_teacher_com.ecom_id = evaluate_company.ecom_id 
              ORDER BY answer_teacher_com.tea_id ASC, answer_teacher_com.ecom_id ASC, answer_teacher_com.anstea_id DESC`;

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

// async function getevaluateall() {
//   var Query;
//   var pool = mysql.createPool(config);

//   return new Promise((resolve, reject) => {
//     Query = `SELECT * FROM evaluate_company
//              INNER JOIN answer_teacher_com ON answer_teacher_com.ecom_id = evaluate_company.ecom_id
//              WHERE is_delete = 0`;

//     console.log('Query1 is: ', Query);

//     pool.query(Query, function (error, results1, fields) {
//       if (error) {
//         pool.end();
//         return resolve({
//           statusCode: 500,
//           message: `'error SQL Query นาจา! '${error}''`,
//         });
//       }

//       if (results1.length > 0) {
//         //results = ผลลัพธ์
//         pool.end();
//         return resolve({
//           statusCode: 200,
//           data: results1,
//         });
//       } else {
//         pool.end();
//         return resolve({
//           statusCode: 500,
//           message: 'Do not have any evaluate!',
//         });
//       }
//     });
//   });
// }

async function answer_teacher(ecom_id, anstea_value, com_id, tea_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO answer_teacher_com (ecom_id, anstea_value, com_id, tea_id)
               VALUES ('${ecom_id}', '${anstea_value}', '${com_id}', '${tea_id}');`;

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
          message: `Successfully answer_teacher with ID '${ecom_id}'`,
        });
      }
    });
  });
}

// ? ---------------------------------------------- ประเมินนักศึกษา (ระหว่างนิเทศ) ------------------------------------------------------------------//

async function getevaluatestudent() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = ` SELECT *
              FROM answer_teacher_stu 
              LEFT JOIN evaluate_student 
              ON answer_teacher_stu.estu_id = evaluate_student.estu_id 
              ORDER BY answer_teacher_stu.Id ASC, answer_teacher_stu.estu_id ASC, answer_teacher_stu.anstu_id DESC`;

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
          message: 'Do not have any Answer!',
        });
      }
    });
  });
}

async function answer_student(estu_id, anstu_value, tea_id, Id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO answer_teacher_stu (estu_id, anstu_value, tea_id, Id)
               VALUES ('${estu_id}', '${anstu_value}', '${tea_id}', '${Id}');`;

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
          message: `Successfully answer_teacher with ID '${estu_id}'`,
        });
      }
    });
  });
}

// ? ---------------------------------------------- ประเมินนักศึกษา (สถานประกอบการประเมินนักศึกษา) ------------------------------------------------------------------//

async function getevaluatecompany_student() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = ` SELECT *
              FROM answer_company_stu 
              LEFT JOIN evaluate_company_stu 
              ON answer_company_stu.ecomstu_id = evaluate_company_stu.ecomstu_id 
              ORDER BY answer_company_stu.Id ASC, answer_company_stu.ecomstu_id ASC, answer_company_stu.anstu_id DESC`;

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
          message: 'Do not have any Answer!',
        });
      }
    });
  });
}

async function answer_company_student(ecomstu_id, anscom_value, com_id, Id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO answer_company_stu (ecomstu_id, anscom_value, com_id, Id)
               VALUES ('${ecomstu_id}', '${anscom_value}', '${com_id}', '${Id}');`;

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
          message: `Successfully answer_teacher with ID '${ecomstu_id}'`,
        });
      }
    });
  });
}

async function getAnswerCompanyStudent(answerDataArray) {
  const pool = mysql.createPool(config);

  const promises = answerDataArray.map((answerData) => {
    const query = `
      INSERT INTO answer_company_stu (ecomstu_id, anscom_value, com_id, Id)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      answerData.ecomstu_id,
      answerData.anscom_value,
      answerData.com_id,
      answerData.Id,
    ];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          return resolve({
            statusCode: 500,
            message: `SQL Error: ${error}`,
          });
        } else {
          return resolve({
            statusCode: 200,
            data: results,
          });
        }
      });
    });
  });

  const results = await Promise.all(promises);
  return results;
}

async function getquestion_student() {
  const pool = mysql.createPool(config);

  const query = 'SELECT * FROM evaluate_student';

  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `SQL Error: ${error}`,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          data: results,
        });
      }
    });
  });
}

async function sendquestion_student(questionDataArray) {
  const pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) connection.release();
        return resolve({
          statusCode: 500,
          message: `Connection Error: ${err}`,
        });
      }

      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          return resolve({
            statusCode: 500,
            message: `Transaction Error: ${err}`,
          });
        }

        try {
          const promises = questionDataArray.map((questionData) => {
            const query = `
              INSERT INTO answer_teacher_stu (estu_id, anstu_value, tea_id, Id)
              VALUES (?, ?, ?, ?)
            `;
            const values = [
              questionData.estu_id,
              questionData.anstu_value,
              questionData.tea_id,
              questionData.Id, // Change this line
            ];
            return new Promise((innerResolve, innerReject) => {
              connection.query(query, values, (error, results) => {
                if (error) {
                  innerReject(error);
                } else {
                  innerResolve(results);
                }
              });
            });
          });

          const results = await Promise.allSettled(promises);

          const failed = results.filter(
            (result) => result.status === 'rejected'
          );

          if (failed.length > 0) {
            connection.rollback();
            connection.release();
            return resolve({
              statusCode: 500,
              message: `SQL Error: ${failed[0].reason}`,
            });
          } else {
            connection.commit();
            connection.release();
            return resolve({
              statusCode: 200,
              data: results.map((result) => result.value),
            });
          }
        } catch (error) {
          connection.rollback();
          connection.release();
          return resolve({
            statusCode: 500,
            message: `Error: ${error}`,
          });
        }
      });
    });
  });
}

module.exports.evaluateRepo = {
  getevaluate: getevaluate,
  answer_teacher: answer_teacher,
  getevaluatestudent: getevaluatestudent,
  answer_student: answer_student,
  getevaluatecompany_student: getevaluatecompany_student,
  answer_company_student: answer_company_student,
  getAnswerCompanyStudent: getAnswerCompanyStudent,
  getquestion_student: getquestion_student,
  sendquestion_student: sendquestion_student,
};
