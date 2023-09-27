var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

//---------------------------------------------------------------------------------- ดูอาจารย์ ----------------------------------------------------------------------------------//

async function getteacher() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT *
                        FROM teacher
                        INNER JOIN curriculum ON curriculum.curriculum_id = teacher.curriculum_id
                        INNER JOIN studygroup ON studygroup.studygroup_id = teacher.studygroup_id
                        WHERE teacher.is_deleted = 0`;

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
          message: 'Do not have any teacher!',
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- เพิ่มข้อมูลอาจารย์ ----------------------------------------------------------------------------------//

async function insertteacher(tea_name, tea_lname, tea_status, tea_tel, curriculum_id, studygroup_id, user, pass) {
  if (!tea_name || !tea_lname || !tea_status || !tea_tel || !curriculum_id || !studygroup_id || !user || !pass) {
    return {
      statusCode: 400,
      message: 'ข้อมูลไม่ครบจ้า',
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO teacher (tea_name, tea_lname, tea_status, tea_tel, curriculum_id, studygroup_id , user, pass)
                VALUES ('${tea_name}', '${tea_lname}', '${tea_status}', '${tea_tel}', '${curriculum_id}', '${studygroup_id}' , '${user}' , '${pass}');`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      pool.end();
      if (error) {
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}'`,
        });
      }

      if (results1.length > 0) {
        return resolve({
          statusCode: 200,
          data: results1,
        });
      } else {
        return resolve({
          statusCode: 500,
          message: `Successfully added teacher with ID '${tea_name}'`,
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- แก้ไขข้อมูลอาจารย์ ----------------------------------------------------------------------------------//

async function teacherupdate(
  tea_id,
  tea_name,
  tea_lname,
  tea_status,
  tea_tel,
  curriculum_id,
  studygroup_id,
  user,
  pass
) {
  if (
    !tea_id ||
    !tea_name ||
    !tea_lname ||
    !tea_status ||
    !tea_tel ||
    !curriculum_id ||
    !studygroup_id ||
    !user ||
    !pass
  ) {
    return {
      statusCode: 400,
      message: 'ข้อมูลไม่ครบจ้า',
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE teacher SET tea_name = '${tea_name}', tea_lname = '${tea_lname}', tea_status = '${tea_status}', tea_tel = '${tea_tel}', curriculum_id = '${curriculum_id}' ,
                     studygroup_id = '${studygroup_id}' , user = '${user}' , pass = '${pass}'
                     WHERE tea_id = ${tea_id}`;

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
        message: `Update Student ${tea_name} Successfully:`,
        id: results1.insertId,
      });
    });
  });
}

//---------------------------------------------------------------------------------- ลบข้อมูลอาจารย์ ----------------------------------------------------------------------------------//

async function teacherdelete(tea_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE teacher SET is_deleted = 1 WHERE tea_id = ${tea_id};`;

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

//---------------------------------------------------------------------------------- เลือกอาจารย์คนเดียว ----------------------------------------------------------------------------------//

async function teacher(tea_id) {
  if (!tea_id) {
    return {
      statusCode: 400,
      message: 'ข้อมูลไม่ครบจ้า',
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM teacher WHERE tea_id = ${tea_id}`;

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

// ? ส่วนที่ทำขึ้นมาใหม่
// อ่านไฟล์เอกสารจาก semester และ year ที่กำหนด
async function getDocumentForTeacher(semester, year) {
  let Query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * 
FROM documents 
INNER JOIN student ON documents.student_id = student.id 
WHERE doc_semester = ${semester} AND doc_year = ${year} 
ORDER BY student_id, doc_type ASC`;

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
          results: results,
        });
      }
    });
  });
}

async function getDocumentNotPass(doc_id) {
  let Query;
  let pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `update documents set doc_version = 2 where doc_id = ${doc_id}`;

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
          message: 'update doc_version to disapprove successfully',
          results: results,
        });
      }
    });
  });
}

module.exports.teacherRepo = {
  getteacher: getteacher,
  insertteacher: insertteacher,
  teacherupdate: teacherupdate,
  teacherdelete: teacherdelete,
  teacher: teacher,

  // ? ส่วนที่ทำขึ้นมาใหม่
  getDocumentForTeacher: getDocumentForTeacher,
  getDocumentNotPass: getDocumentNotPass,
};
