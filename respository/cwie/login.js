/** @format */
var mysql = require('mysql');

//--------------- jwt -----------------
var jwt = require('jsonwebtoken');

//---------------- COOKIE --------------------------------//
const cookieParser = require('cookie-parser');

//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

//------------------------------------------------------------------------ นักศึกษา ------------------------------------------------------------------------//
async function authenticationstu(username, password) {
  var Query;
  var pool = mysql.createPool(config);
  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM student WHERE stu_rmail = '${username}' AND SUBSTR(stu_id, 1, 11) = '${password}'`;
    console.log('Query1 is: ', Query);
    pool.query(Query, function (error, results) {
      if (results.length !== 0) {
        console.log('results is', results[0]);
        const userRole = 'นักศึกษา';
        var token = jwt.sign({ data: username }, 'jwt_secret', {
          expiresIn: '1d',
        });
        var tokenRole = jwt.sign({ dataRole: userRole }, 'jwt_secret_role', {
          expiresIn: '1d',
        });
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          jwt: token,
          jwtRole: tokenRole,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
        });
      }
    });
  });
}

//------------------------------------------------------------------------ อาจารย์ ------------------------------------------------------------------------//
async function authenticationtea(username, password) {
  var Query;
  var pool = mysql.createPool(config);
  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM teacher WHERE user = '${username}' AND pass = '${password}' `;
    console.log('Query1 is: ', Query);
    pool.query(Query, function (error, results) {
      console.log('results is', results);
      if (results.length !== 0) {
        console.log('results is', results[0]);
        const userRole = 'อาจารย์';
        var token = jwt.sign({ data: username }, 'jwt_secret', {
          expiresIn: '1d',
        });
        var tokenRole = jwt.sign({ dataRole: userRole }, 'jwt_secret_role', {
          expiresIn: '1d',
        });
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          jwt: token,
          jwtRole: tokenRole,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
        });
      }
    });
  });
}

//------------------------------------------------------------------------ เจ้าหน้าที่ ------------------------------------------------------------------------//
async function authenticationofficer(username, password) {
  var Query;
  var pool = mysql.createPool(config);
  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM officer WHERE off_user = '${username}' AND off_pass = '${password}' `;
    console.log('Query1 is: ', Query);
    pool.query(Query, function (error, results) {
      if (results.length !== 0) {
        console.log('results is', results[0]);
        const userRole = 'เจ้าหน้าที่';
        var token = jwt.sign({ data: username }, 'jwt_secret', {
          expiresIn: '1d',
        });
        var tokenRole = jwt.sign({ dataRole: userRole }, 'jwt_secret_role', {
          expiresIn: '1d',
        });
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          jwt: token,
          jwtRole: tokenRole,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
        });
      }
    });
  });
}

// //------------------------------------------------------------------------ สถานประกอบการ ------------------------------------------------------------------------//
async function authenticationcom(username, password) {
  var Query;
  var pool = mysql.createPool(config);
  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM company WHERE user = '${username}' AND pass = '${password}' `;
    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results) {
      console.log('results is', results);
      if (results.length !== 0) {
        console.log('results is', results[0]);
        const userRole = 'สถานประกอบการ';
        var token = jwt.sign({ data: username }, 'jwt_secret', {
          expiresIn: '1d',
        });
        var tokenRole = jwt.sign({ dataRole: userRole }, 'jwt_secret_role', {
          expiresIn: '1d',
        });
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          jwt: token,
          jwtRole: tokenRole,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
        });
      }
    });
  });
}

async function verifyauthentication(token, tokenRole) {
  let role;
  let username;

  console.log('tokenRole : ', tokenRole);
  try {
    jwt.verify(token, 'jwt_secret', function (err, decoded) {
      username = decoded.data;
      // console.log('username' + decoded.data);
    });
    jwt.verify(tokenRole, 'jwt_secret_role', function (err, decoded) {
      role = decoded.dataRole;
      console.log(decoded);
      // console.log('role : ' + role);
    });
    return {
      returnCode: '1',
      User: username,
      stateRole: role,
    };
  } catch (err) {
    return { message: err, returnCode: '0' };
  }
}

async function Read_Frist_StudentByUsername(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM student WHERE stu_rmail = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read student successfully');
          resolve(results);
        }
      }
    );
  });
}

async function Read_student(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM student WHERE stu_rmail = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read student successfully');
          resolve(results);
        }
      }
    );
  });
}

async function Read_Frist_TeacherByUsername(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM teacher WHERE user = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read student successfully');
          resolve(results);
        }
      }
    );
  });
}

async function Read_officer(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM officer WHERE off_user = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read student successfully');
          resolve(results);
        }
      }
    );
  });
}

async function getDataStudent(username) {
  const pool = mysql.createPool(config);

  try {
    // Verify the JWT token and get the user data
    const user = await new Promise((resolve, reject) => {
      jwt.verify(username, 'jwt_secret', (err, decoded) => {
        if (err) {
          reject(err);
          console.log('err is', err);
        } else {
          resolve(decoded.data);
          console.log('decoded.data is', decoded.data);
        }
      });
    });

    console.log('user is', user);

    const query = `SELECT * FROM student WHERE stu_rmail = "${user}"`;

    return new Promise((resolve, reject) => {
      // Execute the SQL query
      pool.query(query, (error, results) => {
        if (error) {
          console.error('Error querying data:', error);
          pool.end();
          return resolve({
            statusCode: 404,
            returnCode: 11,
          });
        } else {
          console.log('get Data student successfully');
          pool.end();
          return resolve({
            statusCode: 200,
            returnCode: 1,
            data: results,
          });
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function ReadCompany(username) {
  let query;
  const pool = mysql.createPool(config);

  query = `SELECT * FROM company WHERE user = "${username}"`;

  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error querying data:', error);
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
        });
      } else {
        console.log('get Data company successfully');
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          data: results,
        });
      }
    });
  });
}

async function Read_Company(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM company WHERE user = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read company successfully');
          resolve(results);
        }
      }
    );
  });
}

async function Rstudent(username) {
  const unique_id = uuidv4();
  const pool = mysql.createPool(config);
  // console.log('data1 is', data);

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM student WHERE stu_rmail = "${username}"`,
      function (error, results) {
        if (error) {
          console.error('Error inserting data:', error);
          return reject(error);
        } else {
          console.log('Read company successfully');
          resolve(results);
        }
      }
    );
  });
}

module.exports.authentication = {
  authenticationstu: authenticationstu,
  authenticationtea: authenticationtea,
  authenticationofficer: authenticationofficer,
  authenticationcom: authenticationcom,
  verifyauthentication: verifyauthentication,
  Read_Frist_StudentByUsername: Read_Frist_StudentByUsername,
  Read_Frist_TeacherByUsername: Read_Frist_TeacherByUsername,
  Read_student: Read_student,
  Read_officer: Read_officer,
  getDataStudent: getDataStudent,
  ReadCompany: ReadCompany,
  Read_Company: Read_Company,
  Rstudent: Rstudent,
};
