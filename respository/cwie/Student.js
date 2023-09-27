var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

async function getStudent() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT *
                FROM student
                INNER JOIN curriculum ON curriculum.curriculum_id = student.curriculum_id
                INNER JOIN studygroup ON studygroup.studygroup_id = student.studygroup_id
                WHERE student.is_deleted = 0`;

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
          message: 'Do not have any Student!',
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- เพิ่มข้อมูลนักศึกษา ----------------------------------------------------------------------------------//

async function insertstudent(
  stu_name,
  stu_lname,
  stu_id,
  curriculum_id,
  stu_rmail,
  studygroup_id,
  stu_sex,
  stu_status
) {
  if (
    !stu_name ||
    !stu_lname ||
    !stu_id ||
    !curriculum_id ||
    !stu_rmail ||
    !studygroup_id ||
    !stu_sex ||
    !stu_status
  ) {
    return {
      statusCode: 400,
      message: `'ข้อมูลไม่ครบจ้า`,
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO student (stu_name, stu_lname, stu_id, curriculum_id, stu_rmail, studygroup_id, stu_sex, 
                                             stu_status)
                        VALUES ('${stu_name}', '${stu_lname}', '${stu_id}', '${curriculum_id}', '${stu_rmail}', '${studygroup_id}', 
                                '${stu_sex}', '${stu_status}');`;

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
          message: `Successfully added student with ID '${stu_name}'`,
        });
      }
    });
  });
}

//---------------------------------------------------------------------------------- แก้ไขข้อมูลนักศึกษา ----------------------------------------------------------------------------------//

async function studentupdate(
  Id,
  stu_name,
  stu_lname,
  stu_id,
  stu_rmail,
  stu_status,
  curriculum_id,
  studygroup_id,
  stu_sex
) {
  if (
    !Id ||
    !stu_name ||
    !stu_lname ||
    !stu_id ||
    !curriculum_id ||
    !stu_rmail ||
    !studygroup_id ||
    !stu_sex ||
    !stu_status
  ) {
    return {
      statusCode: 400,
      message: `'ข้อมูลไม่ครบจ้า' ${Id}, ${stu_name}, ${stu_lname}, ${stu_id}, ${stu_rmail}, ${stu_status}, ${curriculum_id}, ${studygroup_id}, ${stu_sex}, `,
    };
  }

  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE student SET stu_name = '${stu_name}', stu_lname = '${stu_lname}', stu_id = '${stu_id}', stu_rmail = '${stu_rmail}' ,
                     stu_status = '${stu_status}', curriculum_id = '${curriculum_id}', studygroup_id = '${studygroup_id}',
                     stu_sex = '${stu_sex}'
                     WHERE Id = ${Id}`;

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

//---------------------------------------------------------------------------------- ลบข้อมูลนักศึกษา ----------------------------------------------------------------------------------//

async function Studentdelete(Id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE student SET is_deleted = 1 WHERE Id = ${Id};`;

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

async function Student(Id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM student WHERE Id = ${Id}`;

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

async function ReadStudentByUsername(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM student WHERE stu_rmail = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error  data:', error);
          return reject(error);
        } else {
          console.log(`'Read Student ${username} successfully'`);
          resolve(results);
        }
      }
    );
  });
}

async function curriculum() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM curriculum `;

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

async function studygroup() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM studygroup `;

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
        message: 'Select studygroup successfully',
        results: results1,
      });
    });
  });
}

async function searchdate(curriculum_name, studygroup_name) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    // if (!curriculumName) {
    //     return resolve({
    //         statusCode: 400,
    //         message: 'Missing curriculum name',
    //     });
    // } else if (!patternName) {
    //     return resolve({
    //         statusCode: 400,
    //         message: 'Missing pattern name',
    //     });
    // }

    Query = `SELECT *
                 FROM student
                 INNER JOIN curriculum ON curriculum.curriculum_id = student.curriculum_id
                 INNER JOIN studygroup ON studygroup.studygroup_id = student.studygroup_id
                 WHERE curriculum.curriculum_name LIKE '%${curriculum_name}%' OR studygroup.studygroup_name LIKE '%${studygroup_name}%'`;

    console.log('Query is: ', Query);

    pool.query(Query, function (error, results, fields) {
      pool.end();
      if (error) {
        pool.end();
        return resolve({
          statusCode: 500,
          message: `'error SQL Query นาจา! '${error}''`,
        });
      }

      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Curriculum selected successfully:',
        data: results,
      });
    });
  });
}

module.exports.StudentRepo = {
  getStudent: getStudent,
  insertstudent: insertstudent,
  studentupdate: studentupdate,
  Studentdelete: Studentdelete,
  Student: Student,
  curriculum: curriculum,
  studygroup: studygroup,
  searchdate: searchdate,
  ReadStudentByUsername: ReadStudentByUsername,
};
