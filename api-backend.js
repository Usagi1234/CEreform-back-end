/** @format */

const hapi = require('@hapi/hapi');
//const H2o2 = require('@hapi/h2o2');
const AuthBearer = require('hapi-auth-bearer-token');
var express = require('express');
const multer = require('multer');
const cors = require('cors');

// const AgentStatus = require('./respository/AgentStatus');
// const Inbound = require('./respository/Inbound');
// const Outbound = require('./respository/Outbound');
// const OnlineAgent = require('./respository/OnlineAgent');
// const Satisfaction = require('./respository/Satisfaction');

//---------------- Portal --------------------------------
const Login = require('./respository/Portal/backend_login');
const upload = require('./respository/Portal/uploadfile');
const teacher = require('./respository/Portal/teacher');
const student = require('./respository/Portal/Student');
const report = require('./respository/Portal/Report');
const news = require('./respository/Portal/news');
const dashboard = require('./respository/Portal/dashborad');

//---------------- Cwie ----------------------------------
const Companyp = require('./respository/cwie/Company');
const Student = require('./respository/cwie/Student');
const teachercwie = require('./respository/cwie/teacher');
const uploadcwie = require('./respository/cwie/upload');
const reportcwie = require('./respository/cwie/report');
const supervision = require('./respository/cwie/supervision');
const login = require('./respository/cwie/login');
const evaluate = require('./respository/cwie/evaluate');

// --------------- env -----------------------------------
const env = require('./env.js');
//---------------- Websocket -----------------------------
const hapiPort = 3000;
const webSocketPort = 3201;
const webPort = 3280;

//---------------- COOKIE --------------------------------
const cookie = require('cookie-parser');
var url = require('url');
const { log } = require('console');
const Joi = require('joi');

//init Express
var app = express();
//init Express Router
var router = express.Router();
// use cors
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
//REST route for GET /status
router.get('/status', function (req, res) {
  res.json({
    status: 'App is running!',
  });
});

//connect path to router
app.use('/', router);

//use cookieParser
app.use(cookie());

app.use(express.static('static'));
var webserver = app.listen(webPort, function () {
  console.log('Websockets listening on port: ' + webSocketPort);
  console.log('Webserver running on port: ' + webPort);
});

//var env = process.env.NODE_ENV || 'development';
//var env = process.env.NODE_ENV || 'production';

console.log('Running Environment: ' + env);

const init = async () => {
  const server = hapi.Server({
    port: hapiPort,
    host: '10.21.45.100',
    routes: {
      cors: true,
    },
  });
  // API TEST CONFIG
  server.route({
    method: 'GET',
    path: '/api/v1/',
    handler: () => {
      return '<h3> Welcome to CE Reform API V1.0.0</h3>';
    },
  });
  // Read_report
  server.route({
    method: 'POST',
    path: '/api/Read_report',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const responsedata = await dashboard.dashboard.dashboard_Read_report();
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // dashboard
  server.route({
    method: 'POST',
    path: '/api/dashboard',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const responsedata = await dashboard.dashboard.dashboard();
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // AddnewsByid
  server.route({
    method: 'POST',
    path: '/api/Addnews',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          Newsname,
          Newsdate,
          Newscontent,
          Newscontent2,
          Newsheading,
          Createby,
        } = request.payload;
        const responsedata = await news.news.Adds_news(
          Newsname,
          Newsdate,
          Newscontent,
          Newscontent2,
          Newsheading,
          Createby,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // DeleteNews
  server.route({
    method: 'POST',
    path: '/api/DeleteNews',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        console.log(id);
        const responsedata = await news.news.delete_news_byId(id);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API UpdateNews !!POST News
  server.route({
    method: 'POST',
    path: '/api/UpdatenewsByid',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          Newsid,
          Newsname,
          Newsdate,
          Newscontent,
          Newscontent2,
          Newsheading,
          Createby,
        } = request.payload;
        const responsedata = await news.news.Update_news_By_id(
          Newsid,
          Newsname,
          Newsdate,
          Newscontent,
          Newscontent2,
          Newsheading,
          Createby,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // ReadTeacherAndImage
  server.route({
    method: 'POST',
    path: '/api/ReadNewsAndImage',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        console.log(id);
        const responsedata = await news.news.Read_news_and_image_Byid(id);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API Add graduate_report
  server.route({
    method: 'POST',
    path: '/api/addReport_graduate',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          SelecteCooperative,
          SelecteCooperativePhone,
          SelectePrefix,
          SelecteFirst,
          SelecteLast,
          SelecteCooperativeTopic,
          SelecteCooperativeContent,
        } = request.payload;
        const responsedata = await report.report.Report_graduate(
          SelecteCooperative,
          SelecteCooperativePhone,
          SelectePrefix,
          SelecteFirst,
          SelecteLast,
          SelecteCooperativeTopic,
          SelecteCooperativeContent,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API UpdateTeacher_education !! POST TEACHER
  server.route({
    method: 'POST',
    path: '/api/UpdateTeacher_education',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          IDowner,
          IDBachelor,
          IDMaster,
          IDDocter,
          // Bachelor
          BachelorCuriculum,
          BachelorMajor,
          BachelorYear,
          BachelorUniversity,
          // Master
          MasterCuriculum,
          MasterMajor,
          MasterYear,
          MasterUniversity,
          // Doctor
          DoctorCuriculum,
          DoctorMajor,
          DoctorYear,
          DoctorUniversity,
        } = request.payload;

        const responsedata =
          await teacher.teacher_detaill.Update_teacher_edutcation(
            IDowner,
            IDBachelor,
            IDMaster,
            IDDocter,
            // Bachelor
            BachelorCuriculum,
            BachelorMajor,
            BachelorYear,
            BachelorUniversity,
            // Master
            MasterCuriculum,
            MasterMajor,
            MasterYear,
            MasterUniversity,
            // Doctor
            DoctorCuriculum,
            DoctorMajor,
            DoctorYear,
            DoctorUniversity,
          );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API UpdateTeacherSubject !!POST TEACHER
  server.route({
    method: 'POST',
    path: '/api/UpdateTeacherSubject',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          id,
          Subjectteach1,
          Subjectteach2,
          Subjectteach3,
          Subjectteach4,
          Subjectteach5,
        } = request.payload;

        const responsedata =
          await teacher.teacher_detaill.Update_teacher_subject(
            id,
            Subjectteach1,
            Subjectteach2,
            Subjectteach3,
            Subjectteach4,
            Subjectteach5,
          );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API UpdateTeacher !!POST TEACHER
  server.route({
    method: 'POST',
    path: '/api/UpdateTeacher',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const {
          id,
          prefix,
          date,
          firstname,
          lastname,
          idrmutl,
          email,
          religion,
          nationality,
          phone,
        } = request.payload;
        const responsedata = await teacher.teacher_detaill.Update_teacher(
          id,
          prefix,
          date,
          firstname,
          lastname,
          idrmutl,
          email,
          religion,
          nationality,
          phone,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API UPDATE !!POST STUDENT
  server.route({
    method: 'POST',
    path: '/api/UpdateStudent',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id, email, date, nationality, religion } = request.payload;

        const responsedata = await student.student.Update_student(
          id,
          email,
          date,
          nationality,
          religion,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API SENT FROM LOGIN !!POST STUDENT
  server.route({
    method: 'POST',
    path: '/api/authentication',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username, password } = request.payload;
        const responsedata = await Login.authentication.authentication(
          username,
          password,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API SENT FROM LOGIN !!POST ADMIN
  server.route({
    method: 'POST',
    path: '/api/authenticationadmin',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username, password } = request.payload;
        const responsedata = await Login.authentication.authenticationadmin(
          username,
          password,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API SENT FROM LOGIN !!POST TEACHER
  server.route({
    method: 'POST',
    path: '/api/authenticationTEA-CHER',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username, password } = request.payload;
        const responsedata = await Login.authentication.authenticationteacher(
          username,
          password,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API VERIFY TOKEN JWT !! POST
  server.route({
    method: 'POST',
    path: '/api/verify_authen',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { token, tokenRole } = request.payload;
        const responsedata = await Login.authentication.verifyauthentication(
          token,
          tokenRole,
        );
        return responsedata;
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ name admin POST
  server.route({
    method: 'POST',
    path: '/api/ReadAdmin',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username } = request.payload;
        const responsedata =
          await Login.authentication.Read_Frist_adminByUsername(username);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ firstname student POST
  server.route({
    method: 'POST',
    path: '/api/ReadStudent',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username } = request.payload;
        const responsedata =
          await Login.authentication.Read_Frist_StudentByUsername(username);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ firstname teacher POST
  server.route({
    method: 'POST',
    path: '/api/ReadTeacher',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username } = request.payload;
        const responsedata =
          await Login.authentication.Read_Frist_teacherByUsername(username);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ STUDENT WHERE RMUTL ID
  server.route({
    method: 'POST',
    path: '/api/ReadStudentByUsername',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { username } = request.payload;
        const responsedata = await student.student.ReadStudentByUsername(
          username,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata.jwt);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ TEACHER WHERE RMUTL ID
  server.route({
    method: 'POST',
    path: '/api/ReadTeacherByEmail',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { email } = request.payload;
        const responsedata = await teacher.teacher_detaill.thecher_listByEmail(
          email,
        );
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API READ EDUCATE TEACHER WHERE Id
  server.route({
    method: 'POST',
    path: '/api/ReadEducateTeacherById',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        const responsedata =
          await teacher.teacher_detaill.ReadEducateTeacherById(id);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  //API upload file pdf
  server.route({
    method: 'POST',
    path: '/api/uploadfilePDF',
    config: {
      payload: {
        multipart: true,
        parse: true,
        output: 'stream',
        allow: ['multipart/form-data', 'application/pdf'], // Specify the allowed content type for the request
        maxBytes: 10 * 1024 * 1024, // Set a maximum file size (optional)
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const file = request.payload['pdf-file'];
        const owner = request.payload['owner'];
        const year = request.payload['year'];
        const type = request.payload['type'];
        const milliseconds = new Date().getTime();
        const fileName = file.hapi.filename;
        const filePath = `../Documenets/${milliseconds}-${fileName}`;

        // Save the file to disk
        const fs = require('fs');
        const fileStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
          file.on('error', (err) => {
            reject(err);
          });
          file.pipe(fileStream);
          file.on('end', () => {
            resolve();
          });
        });
        const responsedata = await uploadcwie.uploadfile.upload_pdf(
          fileName,
          milliseconds,
          owner,
          year,
          type,
        );

        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  //API GetfilePDF
  server.route({
    method: 'GET',
    path: '/api/GetfilePFD',
    handler: async function (reply) {
      try {
        const responseData = await upload.uploadfile.read_file();
        if (responseData.error) {
          return responseData.errMessage;
        } else {
          return responseData;
        }
      } catch (error) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  // API uploadimageTeacher
  server.route({
    method: 'POST',
    path: '/api/uploadimageTeacher',
    config: {
      payload: {
        multipart: true,
        parse: true,
        output: 'stream',
        allow: ['multipart/form-data', 'application/pdf'], // Specify the allowed content type for the request
        maxBytes: 10 * 1024 * 1024, // Set a maximum file size (optional)
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, h) {
      try {
        const fs = require('fs');
        let responsedata = [null];
        const ownerid = request.payload['owner'];
        // console.log('ownerid:', ownerid);
        for (const [fieldname, file] of Object.entries(request.payload)) {
          if (file && file.hapi && file.hapi.filename) {
            const filename = file.hapi.filename;
            const data = file._data;
            // Save the image file to disk (you can choose your desired destination)
            const destinationPath = `/Users/baconinhell/Desktop/dandelion-pro_v25/starter-project/image/teacher/${filename}`;
            const fileStream = fs.createWriteStream(destinationPath);
            fileStream.write(data);
            fileStream.end();
            responsedata = upload.uploadfile.upload_image_tea_profile(
              filename,
              ownerid,
            );
          } else {
            console.log('Invalid file object:', file);
          }
        }
        // Return a response after successful image upload
        return h.response(
          'Images uploaded and inserted into the database successfully.',
        );
      } catch (err) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  // API uploadimageStudent
  server.route({
    method: 'POST',
    path: '/api/uploadimageStudent',
    config: {
      payload: {
        multipart: true,
        parse: true,
        output: 'stream',
        allow: ['multipart/form-data', 'application/pdf'], // Specify the allowed content type for the request
        maxBytes: 10 * 1024 * 1024, // Set a maximum file size (optional)
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, h) {
      try {
        const fs = require('fs');
        let responsedata = [null];
        const ownerid = request.payload['owner'];
        // console.log('Payload:', request.payload);
        for (const [fieldname, file] of Object.entries(request.payload)) {
          if (file && file.hapi && file.hapi.filename) {
            const filename = file.hapi.filename;
            const data = file._data;
            // Save the image file to disk (you can choose your desired destination)
            const destinationPath = `/Users/baconinhell/Desktop/dandelion-pro_v25/starter-project/image/student/${filename}`;
            const fileStream = fs.createWriteStream(destinationPath);
            fileStream.write(data);
            fileStream.end();

            responsedata = upload.uploadfile.upload_image_stu_profile(
              filename,
              ownerid,
            );
          } else {
            console.log('Invalid file object:', file);
          }
        }
        // Return a response after successful image upload
        return h.response(
          'Images uploaded and inserted into the database successfully.',
        );
      } catch (err) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  // API uploadmutipleimage max 4 form front-end
  server.route({
    method: 'POST',
    path: '/api/uploadimageNew',
    config: {
      payload: {
        multipart: true,
        parse: true,
        output: 'stream',
        allow: ['multipart/form-data', 'application/pdf'], // Specify the allowed content type for the request
        maxBytes: 10 * 1024 * 1024, // Set a maximum file size (optional)
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, h) {
      try {
        const fs = require('fs');
        let responsedata = [null];
        const ownerid = request.payload['id_owner '];
        // console.log('Payload:', request.payload);
        for (const [fieldname, file] of Object.entries(request.payload)) {
          if (file && file.hapi && file.hapi.filename) {
            const filename = file.hapi.filename;
            const data = file._data;
            // Save the image file to disk (you can choose your desired destination)
            const destinationPath = `/Users/baconinhell/Desktop/dandelion-pro_v25/starter-project/image/ImageNew/${filename}`;
            const fileStream = fs.createWriteStream(destinationPath);
            fileStream.write(data);
            fileStream.end();
            console.log('filename:', filename);
            responsedata = upload.uploadfile.upload_image(filename, ownerid);
          } else {
            console.log('Invalid file object:', file);
          }
        }
        // Return a response after successful image upload
        return h.response(
          'Images uploaded and inserted into the database successfully.',
        );
      } catch (err) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });

  // API addNewsViewByID
  server.route({
    method: 'POST',
    path: '/api/addNewsViewByID',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { Id, View } = request.payload;

        const responsedata = await upload.uploadfile.addNewsViewByID(Id, View);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          // console.log(responsedata);
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  //API GetNewlist
  server.route({
    method: 'GET',
    path: '/api/GetNews',
    handler: async function (reply) {
      try {
        const responseData = await news.news.ReadNews();
        // console.log('responseData is ', responseData);

        if (responseData.error) {
          return responseData.errMessage;
        } else {
          return responseData;
        }
      } catch (error) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  //API GetNewlist
  server.route({
    method: 'GET',
    path: '/api/GetNewlist',
    handler: async function (reply) {
      try {
        const responseData = await upload.uploadfile.read_Newlist();
        // console.log('responseData is ', responseData);

        if (responseData.error) {
          return responseData.errMessage;
        } else {
          return responseData;
        }
      } catch (error) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });
  // API READ IMAGE
  server.route({
    method: 'GET',
    path: '/api/Readimagenew',

    handler: async function (request, h) {
      try {
        const responseData = await upload.uploadfile.read_imagelist(); // Use 'uploadfile' instead of 'upload.uploadfile'
        if (responseData.error) {
          return responseData.errMessage;
        } else {
          return responseData;
        }
      } catch (err) {
        console.error('Error reading image from the database:', err);
        throw err;
      }
    },
  });
  //API UPDATE IMAGE
  server.route({
    method: 'POST',
    path: '/api/Updateimage',
    config: {
      payload: {
        multipart: true,
        parse: true,
        output: 'stream',
        allow: ['multipart/form-data', 'application/pdf'], // Specify the allowed content type for the request
        maxBytes: 10 * 1024 * 1024, // Set a maximum file size (optional)
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, h) {
      try {
        const fs = require('fs');
        let responsedata = [null];
        const ownerid = request.payload['id_owner '];
        // console.log('Payload:', request.payload);
        for (const [fieldname, file] of Object.entries(request.payload)) {
          if (file && file.hapi && file.hapi.filename) {
            const data = file._data;
            responsedata = upload.uploadfile.update_image(data, ownerid);
            console.log('OK !!');
          } else {
            console.log('Invalid file object:', file);
          }
        }
        // Return a response after successful image upload
        return h.response(
          'Images uploaded and inserted into the database successfully.',
        );
      } catch (err) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });

  //READ NEWS LIST
  server.route({
    method: 'POST',
    path: '/api/listnews_detail',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        const responsedata = await upload.uploadfile.read_NewDetaill(id);
        return responsedata;
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });

  //API GetReadfileimage
  server.route({
    method: 'POST',
    path: '/api/Getimagesnews',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        // console.log('id is ', id);
        const responseData = await upload.uploadfile.read_ImageNewlist(id);
        return responseData;
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  // API InsertViewNew
  server.route({
    method: 'POST',
    path: '/api/InsertViewNew',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { valuenew } = request.payload;
        // console.log('id is ', id);
        const responseData = await upload.uploadfile.InsertViewNews(valuenew);
        return responseData;
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
  //API TEACHER LIST
  server.route({
    method: 'GET',
    path: '/api/Teacher_list',
    handler: async function (reply) {
      try {
        const responseData = await teacher.teacher_detaill.thecher_list();
        if (responseData.error) {
          return responseData.errMessage;
        } else {
          return responseData;
        }
      } catch (error) {
        server.log(['error', 'home'], err);
        throw err; // Throw the error to indicate a failure
      }
    },
  });

  //API ReadTeacher By ID
  server.route({
    method: 'POST',
    path: '/api/ReadTeacherByID',
    config: {
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        const { id } = request.payload;
        // console.log('id is ', id);
        const responseData =
          await teacher.teacher_detaill.T_Read_thecher_listById(id);
        return responseData;
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });

  //--------------------------------------------------------- โปรเจคกูที่แปลว่าฟิวส์ (cwie) ----------------------------------------------------------------------------------- 

    //---------------------------------------------------------- สถานประกอบการ ---------------------------------------------------------------//
    {
      /**GET /api/v1/companys */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/companys',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await Companyp.CompanyRepo.getcompanys();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/companyinsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/companyinsert',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { com_name, com_type, com_add, com_province, com_contact, user, pass } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Companyp.CompanyRepo.companyinsert(
            com_name,
            com_type,
            com_add,
            com_province,
            com_contact,
            user,
            pass
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/companyupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/companyupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { com_id, com_name, com_type, com_add, com_province, com_contact, user, pass } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Companyp.CompanyRepo.companyupdate(
            com_id,
            com_name,
            com_type,
            com_add,
            com_province,
            com_contact,
            user,
            pass
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**DELETE /api/v1/companydelete */
    }
    server.route({
      method: 'DELETE',
      path: '/api/v1/companydelete',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { com_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Companyp.CompanyRepo.compantdelete(com_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- นักศึกษา ---------------------------------------------------------------------------------//
    {
      /**GET /api/v1/students */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/students',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await Student.StudentRepo.getStudent();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/studentinsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/studentinsert',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { stu_name, stu_lname, stu_id, curriculum_id, stu_rmail, studygroup_id, stu_sex, stu_status } =
            request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Student.StudentRepo.insertstudent(
            stu_name,
            stu_lname,
            stu_id,
            curriculum_id,
            stu_rmail,
            studygroup_id,
            stu_sex,
            stu_status
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/studentupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/studentupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { Id, stu_name, stu_lname, stu_id, stu_rmail, stu_status, curriculum_id, studygroup_id, stu_sex } =
            request.payload;
  
          const responsedata = await Student.StudentRepo.studentupdate(
            Id,
            stu_name,
            stu_lname,
            stu_id,
            stu_rmail,
            stu_status,
            curriculum_id,
            studygroup_id,
            stu_sex
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**DELETE /api/v1/Studentdelete */
    }
    server.route({
      method: 'DELETE',
      path: '/api/v1/Studentdelete',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { Id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Student.StudentRepo.Studentdelete(Id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/ReadStudentByUsername */
    }
    server.route({
      method: 'POST',
      path: '/api/ReadStudentByUsernamecwie',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await Student.StudentRepo.ReadStudentByUsername(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- อาจารย์ ---------------------------------------------------------------------//
    {
      /**GET /api/v1/teacher */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/teachers',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await teachercwie.teacherRepo.getteacher();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/insertteacher */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/insertteacher',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { tea_name, tea_lname, tea_status, tea_tel, curriculum_id, studygroup_id, user, pass } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await teachercwie.teacherRepo.insertteacher(
            tea_name,
            tea_lname,
            tea_status,
            tea_tel,
            curriculum_id,
            studygroup_id,
            user,
            pass
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/teacherupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/teacherupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { tea_id, tea_name, tea_lname, tea_status, tea_tel, curriculum_id, studygroup_id, user, pass } =
            request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await teachercwie.teacherRepo.teacherupdate(
            tea_id,
            tea_name,
            tea_lname,
            tea_status,
            tea_tel,
            curriculum_id,
            studygroup_id,
            user,
            pass
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**DELETE /api/v1/teacherdelete */
    }
    server.route({
      method: 'DELETE',
      path: '/api/v1/teacherdelete',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { tea_id } = request.payload;
          console.log('test');
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await teachercwie.teacherRepo.teacherdelete(tea_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- นิเทศ(สถานประกอบการ) ---------------------------------------------------------------------//
    {
      /**GET /api/v1/supervisioncom */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/supervisioncom',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await supervision.supervisionRepo.getsupercom();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisioncominsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisioncominsert',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { su_need, su_time, su_detail, su_coor, su_date, su_sugges, com_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visioncominsert(
            su_need,
            su_time,
            su_detail,
            su_coor,
            su_date,
            su_sugges,
            com_id
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisioncomupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisioncomupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { su_comid, su_need, su_time, su_detail, su_coor, su_sugges } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visioncomupdate(
            su_comid,
            su_need,
            su_time,
            su_detail,
            su_coor,
            su_sugges
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- นิเทศ(อาจารย์) ---------------------------------------------------------------------//
    {
      /**GET /api/v1/supervisiontea */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/supervisiontea',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await supervision.supervisionRepo.getsupertea();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisionteainsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisionteainsert',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const {
            su_day,
            su_mon,
            su_year,
            su_time,
            su_daparment,
            su_mname,
            su_job,
            su_numstu,
            su_sugges,
            com_id,
            tea_id,
          } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visionteainsert(
            su_day,
            su_mon,
            su_year,
            su_time,
            su_daparment,
            su_mname,
            su_job,
            su_numstu,
            su_sugges,
            com_id,
            tea_id
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisionteaupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisionteaupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { su_teaid, su_day, su_mon, su_year, su_time, su_daparment, su_mname, su_job, su_numstu, su_sugges } =
            request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visionteaupdate(
            su_teaid,
            su_day,
            su_mon,
            su_year,
            su_time,
            su_daparment,
            su_mname,
            su_job,
            su_numstu,
            su_sugges
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- นิเทศ(นักศึกษา) ---------------------------------------------------------------------//
    {
      /**GET /api/v1/supervisionstu */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/supervisionstu',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await supervision.supervisionRepo.getsuperstu();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisionstuinsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisionstuinsert',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { su_timein, su_timeout, su_holiday, su_time, su_work, su_sugges, com_id, Id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visionstuinsert(
            su_timein,
            su_timeout,
            su_holiday,
            su_time,
            su_work,
            su_sugges,
            com_id,
            Id
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/supervisionteaupdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/supervisionstuupdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { su_stuid, su_timein, su_timeout, su_holiday, su_time, su_work, su_sugges } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await supervision.supervisionRepo.visionstuupdate(
            su_stuid,
            su_timein,
            su_timeout,
            su_holiday,
            su_time,
            su_work,
            su_sugges
          ); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- สถานะ ---------------------------------------------------------------------//
    {
      /**GET /api/v1/status */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/status',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await reportcwie.ReposrtRepo.getstatus();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- รายงาน ---------------------------------------------------------------------//
    {
      /**GET /api/v1/getfilepdf */
    }
    server.route({
      method: 'GET',
      path: '/api/getfilepdf',
      handler: async function (reply) {
        try {
          const responseData = await uploadcwie.uploadFile.read_file();
          if (responseData.error) {
            return responseData.errMessage;
          } else {
            return responseData;
          }
        } catch (error) {
          server.log(['error', 'home'], err);
          throw err; // Throw the error to indicate a failure
        }
      },
    });
    {
      /**GET /api/v1/getreport */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/getreport',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await reportcwie.ReposrtRepo.getreport();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/insertreport */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/insertreport',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { re_hname, re_week, re_details, Id, com_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await reportcwie.ReposrtRepo.insertreport(re_hname, re_week, re_details, Id, com_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/updatereport */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/updatereport',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { re_id, re_hname, re_week, re_details, Id, com_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await reportcwie.ReposrtRepo.updatereport(re_id, re_hname, re_week, re_details, Id, com_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**DELETE /api/v1/deletereport */
    }
    server.route({
      method: 'DELETE',
      path: '/api/v1/deletereport',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { re_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await reportcwie.ReposrtRepo.deletereport(re_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/pdfdelete */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/pdfdelete',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { up_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await uploadcwie.uploadFile.pdfdelete(up_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- เลือกคนเดียว ---------------------------------------------------------------------//
    {
      /**POST /api/v1/student */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/student',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { Id } = request.payload;
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Student.StudentRepo.Student(Id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/company */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/company',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { com_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Companyp.CompanyRepo.company(com_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/teacher */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/teacher',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { tea_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await teachercwie.teacherRepo.teacher(tea_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- หลักสูตร ---------------------------------------------------------------------//
    {
      /**POST /api/v1/curriculum */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/curriculum',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await Student.StudentRepo.curriculum(); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    //---------------------------------------------------------- กลุ่มเรียน ---------------------------------------------------------------------//
    {
      /**POST /api/v1/studygroup */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/studygroup',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          // const {
          //     curriculumId,
          // } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Student.StudentRepo.studygroup(); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ---------------------------------------------------------- อัปโหลดไฟล์ ---------------------------------------------------------------------//
  
    {
      /** /api/v1/uploadimg */
    }
    server.route({
      method: 'POST',
      path: '/api/uploadimg',
      config: {
        payload: {
          output: 'stream',
          parse: true,
          allow: ['multipart/form-data', 'application/img'],
          maxBytes: 10 * 1024 * 1024, // กำหนดขนาดไฟล์สูงสุด (ในบายต์)
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, h) {
        try {
          const file = request.payload['img'];
          const new_img = new Date().getTime();
          const new_name = file.hapi.filename;
          const filePath = '../Documenets/' + new_img + '-' + new_name;
  
          // อัปโหลดไฟล์รูปภาพโดยใช้ multer
          await upload.single('img')(request, h);
  
          // เพิ่มโค้ดที่คุณต้องการทำหลังจากการอัปโหลดไฟล์
          // Save the file to disk
          const fs = require('fs');
          const fileStream = fs.createWriteStream(filePath);
          await new Promise((resolve, reject) => {
            file.on('error', (err) => {
              reject(err);
            });
            file.pipe(fileStream);
            file.on('end', () => {
              resolve();
            });
          });
  
          const responsedata = await uploadcwie.uploadFile.upload_img(new_name, new_img);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          throw err; // ส่งข้อผิดพลาดเพื่อแสดงให้เห็นว่าการอัปโหลดล้มเหลว
        }
      },
    });
  
    //---------------------------------------------------------- ค้นหาข้อมูล ---------------------------------------------------------------------//
    {
      /** /api/v1/searchdate */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/searchdate',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { curriculum_name, studygroup_name } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await Student.StudentRepo.searchdate(curriculum_name, studygroup_name);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- ข่าว ---------------------------------------------------------------------//
    {
      /** /api/v1/getnews */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/getnews',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await reportcwie.ReposrtRepo.getnews();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/v1/insertnew */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/insertnew',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { new_name, new_img, new_details } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await reportcwie.ReposrtRepo.insertnew(new_name, new_img, new_details);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /**POST /api/v1/deletenew */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/deletenew',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { new_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await reportcwie.ReposrtRepo.deletenew(new_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    //---------------------------------------------------------- login ---------------------------------------------------------------------//
    {
      /** /api/authenticationstu */
    }
    server.route({
      method: 'POST',
      path: '/api/authenticationstu',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username, password } = request.payload;
          const responsedata = await login.authentication.authenticationstu(username, password);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/authenticationtea */
    }
    server.route({
      method: 'POST',
      path: '/api/authenticationtea',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username, password } = request.payload;
          const responsedata = await login.authentication.authenticationtea(username, password);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/authenticationofficer */
    }
    server.route({
      method: 'POST',
      path: '/api/authenticationofficer',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username, password } = request.payload;
          const responsedata = await login.authentication.authenticationofficer(username, password);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/authenticationcom */
    }
    server.route({
      method: 'POST',
      path: '/api/authenticationcom',
      config: {
        cors: {
          origin: ['*'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username, password } = request.payload;
          const responsedata = await login.authentication.authenticationcom(username, password);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/ReadStudent */
    }
    server.route({
      method: 'POST',
      path: '/api/ReadStudentcwie',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await login.authentication.Read_Frist_StudentByUsername(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/Readofficer */
    }
    server.route({
      method: 'POST',
      path: '/api/Readofficer',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await login.authentication.Read_officer(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
    {
      /** /api/ReadTeacher */
    }
    server.route({
      method: 'POST',
      path: '/api/ReadTeachercwie',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await login.authentication.Read_Frist_TeacherByUsername(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ?------------------------------------------------------------------ ทำขึ้นใหม่ --------------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------------- อัพโหลด ---------------------------------------------------------------------//
    {
      /** /api/v1/uploadfilepdf */
    }
    server.route({
      method: 'POST',
      path: '/api/uploadFile',
      options: {
        payload: {
          output: 'stream',
          parse: true,
          multipart: true,
          allow: 'multipart/form-data',
        },
        validate: {
          payload: Joi.object({
            student_id: Joi.number().required(),
            company_id: Joi.number().required(),
            doc_filename: Joi.string().required(),
            doc_filepath: Joi.string().required(),
            doc_semester: Joi.number().required(),
            doc_year: Joi.number().required(),
            doc_type: Joi.number().required(),
            doc_version: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        console.log(request.payload);
        try {
          const { student_id, company_id, doc_filename, doc_filepath, doc_semester, doc_year, doc_type, doc_version } =
            request.payload;
  
          const responsedata = await uploadcwie.uploadFile.uploadDocument(
            student_id,
            company_id,
            doc_filename,
            doc_filepath,
            doc_semester,
            doc_year,
            doc_type,
            doc_version
          );
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], err);
          throw err;
        }
      },
    });
  
    // ?------------------------------------------------------------------ อัพเดทข้อมูลสำหรับอาจารย์และเจ้าหน้าที่ --------------------------------------------------------------------------------------------------------------------------//
    server.route({
      method: 'POST',
      path: '/api/uploadFileTeacher',
      options: {
        payload: {
          output: 'stream',
          parse: true,
          multipart: true,
          allow: 'multipart/form-data',
        },
        validate: {
          payload: Joi.object({
            student_id: Joi.number().required(),
            doc_filename: Joi.string().required(),
            doc_filepath: Joi.string().required(),
            doc_type: Joi.number().required(),
            doc_version: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        console.log(request.payload);
        try {
          const { student_id, doc_filename, doc_filepath, doc_type, doc_version } = request.payload;
  
          const responsedata = await uploadcwie.uploadFile.uploadDocumentTeacher(
            student_id,
            doc_filename,
            doc_filepath,
            doc_type,
            doc_version
          );
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], err);
          throw err;
        }
      },
    });
  
    // ?------------------------------------------------------------------ อ่านข้อมูล --------------------------------------------------------------------------------------------------------------------------//
    // ** ดึงข้อมูลนักศึกษา
    server.route({
      method: 'POST',
      path: '/api/getDataStudent',
      handler: async (request, h) => {
        try {
          const { username } = request.payload;
          console.log('test: ', username);
          const responsedata = await login.authentication.getDataStudent(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านค่าปีการศึกษาล่าสุด ---------------------------------------------------------------------//
  
    server.route({
      method: 'GET',
      path: '/api/getSemesterYear',
      handler: async (request, h) => {
        try {
          const responsedata = await uploadcwie.uploadFile.checkLastSemester();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านค่าปีการศึกษาลทั้งหมด ---------------------------------------------------------------------//
  
    server.route({
      method: 'GET',
      path: '/api/getAllSemesterYear',
      handler: async (request, h) => {
        try {
          const responsedata = await uploadcwie.uploadFile.getAllSemesterYear();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านไฟล์นักศึกษา ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/getFileStudent',
      handler: async (request, h) => {
        try {
          const { student_id } = request.payload;
          const responsedata = await uploadcwie.uploadFile.getFileStudent(student_id);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านไฟล์นักศึกษาสำหรับอาจารย์และเจ้าหน้าที่ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/getDocumentsForTeacher',
      handler: async (request, h) => {
        try {
          const { semester, year } = request.payload;
          const responsedata = await teachercwie.teacherRepo.getDocumentForTeacher(semester, year);
  
          console.log('semester: ', semester);
          console.log('year: ', year);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- เอกสารไม่ผ่านการตรวจสอบ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/getDocumentsNotPass',
      handler: async (request, h) => {
        try {
          const { doc_id } = request.payload;
          const responsedata = await teachercwie.teacherRepo.getDocumentNotPass(doc_id);
  
          console.log('doc_id: ', doc_id);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- แสดงเอกสารตอบกลับของสถานประกอบการ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/getDocumentsReply',
      handler: async (request, h) => {
        try {
          const { com_id } = request.payload;
  
          const responsedata = await Companyp.CompanyRepo.getFileCompany(com_id);
  
          console.log('com_id: ', com_id);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- ส่งเอกสารตอบกลับของสถานประกอบการ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/sendDocumentsReply',
      options: {
        payload: {
          output: 'stream',
          parse: true,
          multipart: true,
          allow: 'multipart/form-data',
        },
        validate: {
          payload: Joi.object({
            company_id: Joi.number().required(),
            ad_filename: Joi.string().required(),
            ad_filepath: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const { company_id, ad_filename, ad_filepath } = request.payload;
  
          console.log('company_id: ', company_id);
          console.log('ad_filename: ', ad_filename);
          console.log('ad_filepath: ', ad_filepath);
  
          const responsedata = await Companyp.CompanyRepo.sendFileCompany(company_id, ad_filename, ad_filepath);
  
          if (responsedata.error) {
            return h
              .response({
                statusCode: responsedata.statusCode,
                message: responsedata.errMessage,
              })
              .code(responsedata.statusCode);
          } else {
            return h
              .response({
                statusCode: 200,
                message: 'Insert successfully',
                data: responsedata,
              })
              .code(200);
          }
        } catch (error) {
          server.log(['error', 'home'], error);
          return h
            .response({
              statusCode: 500,
              message: 'Internal Server Error',
            })
            .code(500);
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านข้อมูลสถานประกอบการจาก id ของสถานประกอบ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/getCompanyById',
      handler: async (request, h) => {
        try {
          const { com_id } = request.payload;
  
          const responsedata = await Companyp.CompanyRepo.getCompanyByID(com_id);
  
          console.log('com_id: ', com_id);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          console.log(error);
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านไฟล์เอกสารตอบกลับของสถานประกอบการ สำหรับเจ้าหน้าที่ ---------------------------------------------------------------------//
  
    server.route({
      method: 'GET',
      path: '/api/getFileCompanyForOfficer',
      handler: async (request, h) => {
        try {
          const responsedata = await uploadcwie.uploadFile.getFileCompanyForOfficer();
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          console.log(error);
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    // ? ---------------------------------------------------------- อ่านข้อมูลสถานประกอบการ ---------------------------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/ReadCompany',
      handler: async (request, h) => {
        try {
          const { username } = request.payload;
  
          const responsedata = await login.authentication.ReadCompany(username);
  
          console.log('username: ', username);
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (error) {
          console.log(error);
          server.log(['error', 'home'], error);
          throw error;
        }
      },
    });
  
    server.route({
      method: 'POST',
      path: '/api/Read_Company',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await login.authentication.Read_Company(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    server.route({
      method: 'POST',
      path: '/api/Rstudent',
      config: {
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const { username } = request.payload;
          const responsedata = await login.authentication.Rstudent(username);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            // console.log(responsedata.jwt);
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ? --------------------------------------------------- ประเมินสถานประกอบการ (อาจารย์ประเมินสถานประกอบการ)  ------------------------------------------------------//
  
    {
      /**GET /api/v1/getevaluate */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/getevaluate',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await evaluate.evaluateRepo.getevaluate();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    {
      /**POST /api/v1/companyinsert */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/answer_teacher',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { ecom_id, anstea_value, com_id, tea_id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await evaluate.evaluateRepo.answer_teacher(ecom_id, anstea_value, com_id, tea_id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ? ----------------------------------------------------------- ประเมินนักศึกษา (ระหว่างนิเทศ)  --------------------------------------------------------------//
  
    {
      /**GET /api/v1/getevaluatestudent */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/getevaluatestudent',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await evaluate.evaluateRepo.getevaluatestudent();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    {
      /**POST /api/v1/answer_student */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/answer_student',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { estu_id, anstu_value, tea_id, Id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await evaluate.evaluateRepo.answer_student(estu_id, anstu_value, tea_id, Id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ? -------------------------------------------------------- ประเมินนักศึกษา (สถานประกอบการประเมินนักศึกษา)  -------------------------------------------------//
  
    {
      /**GET /api/v1/getevaluatecompany_student */
    }
    server.route({
      method: 'GET',
      path: '/api/v1/getevaluatecompany_student',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          const responsedata = await evaluate.evaluateRepo.getevaluatecompany_student();
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    {
      /**POST /api/v1/answer_company_student */
    }
    server.route({
      method: 'POST',
      path: '/api/v1/answer_company_student',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { ecomstu_id, anscom_value, com_id, Id } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await evaluate.evaluateRepo.answer_company_student(ecomstu_id, anscom_value, com_id, Id); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ?
  
    server.route({
      method: 'POST',
      path: '/api/v2/answer_company_student',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, reply) {
        try {
          // body requests
          const { answerData } = request.payload;
  
          // if (stu_id != '') { // ถ้า stu_id ไม่ว่าง = มีข้อมูลนั้นละ
          const responsedata = await evaluate.evaluateRepo.getAnswerCompanyStudent(answerData); //ดึงใช้ฟังชั่นจากไฟล์ student ดึงแค่ 1 คนจาก id
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ? -------------------------------------------------------- ส่งคำถามแบบประเมินนักศึกษา -------------------------------------------------//
  
    server.route({
      method: 'GET',
      path: '/api/v1/getquestion_student',
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
  
      handler: async function (request, reply) {
        try {
          const responsedata = await evaluate.evaluateRepo.getquestion_student();
  
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return err;
        }
      },
    });
  
    // ? -------------------------------------------------------- ส่งแบบประเมินนักศึกษา -------------------------------------------------//
  
    server.route({
      method: 'POST',
      path: '/api/v1/sendquestion_student',
      config: {
        // config for multi body request
        payload: {
          multipart: true,
          parse: true, // ensures payload is parsed
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-width'],
        },
      },
      handler: async function (request, h) {
        // Changed "reply" to "h" based on more recent Hapi versions
        try {
          let answerData = request.payload.answerData;
  
          // If answerData is a string, try to parse it as JSON
          if (typeof answerData === 'string') {
            answerData = JSON.parse(answerData);
          }
  
          const responsedata = await evaluate.evaluateRepo.sendquestion_student(answerData);
  
          if (responsedata.error) {
            return h
              .response({
                statusCode: 500,
                message: responsedata.errMessage,
              })
              .code(500);
          } else {
            return responsedata;
          }
        } catch (err) {
          server.log(['error', 'home'], err);
          return h
            .response({
              statusCode: 500,
              message: err.message,
            })
            .code(500);
        }
      },
    });


  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

//--- Schedule setAvgWaitingTime API Call every 15 minutes -----

// var schedule = require('node-schedule');
// var request = require('request');

// var serverUrl = 'http://localhost:3200/api';

// schedule.scheduleJob('*/15 * * * *', function () {
//     var options = {
//         url: serverUrl + '/setavgwaitingtime',
//         /*
//         headers: {
//             'X-Parse-Application-Id': appID,
//             'X-Parse-Master-Key': masterKey,
//             'Content-Type': 'application/json'
//         }
//         */
//     };
//     request.post(options, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             //console.log(body);
//             console.log("Call setAvgWaitingTime API OK!!");
//         } else
//             console.log("Call setAvgWaitingTime API ERROR!!");
//     });

// });

//-----------------------
