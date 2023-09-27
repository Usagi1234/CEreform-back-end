var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid')
const uuid = uuidv4()

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];

async function getsupercom() {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`SELECT * FROM supercom
                        INNER JOIN company ON company.com_id = supercom.com_id 
                        WHERE supercom.is_deleted = 0`;

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: 'Do not have any supervision company!',
                });
            }

        });

    });
}
async function visioncominsert(su_need, su_time, su_detail, su_coor,su_date, su_sugges, com_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`INSERT INTO supercom (su_need, su_time, su_detail, su_coor,su_date, su_sugges, com_id)
                        VALUES ('${su_need}', '${su_time}', '${su_detail}', '${su_coor}', '${su_date}', '${su_sugges}', '${com_id}');`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 200,
                    message: `Successfully `,
                });
            }

        });

    });
}
async function visioncomupdate(su_comid, su_need, su_time, su_detail, su_coor, su_sugges) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

            Query = `UPDATE supercom SET su_need = '${su_need}', su_time = '${su_time}', su_detail = '${su_detail}', su_coor = '${su_coor}' ,
                                         su_sugges = '${su_sugges}' WHERE su_comid = ${su_comid}`
        
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
                message: `update supervision company ${su_detail} Successfuly:`,
                id: results1.insertId,
            })

        });

    });
}

async function getsupertea() {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`SELECT * FROM supertea 
                        INNER JOIN company ON company.com_id = supertea.com_id
                        INNER JOIN teacher ON teacher.tea_id  = supertea.tea_id  
                        WHERE supertea.is_deleted = 0`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: 'Do not have any supervision teacher!',
                });
            }

        });

    });
}
async function visionteainsert(su_day, su_mon, su_year, su_time, su_daparment, su_mname,su_job , su_numstu, su_sugges, com_id, tea_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`INSERT INTO supertea (su_day, su_mon, su_year, su_time, su_daparment, su_mname, su_job ,su_numstu, su_sugges, com_id, tea_id)
                        VALUES ('${su_day}', '${su_mon}', '${su_year}', '${su_time}', '${su_daparment}', '${su_mname}', '${su_job}', '${su_numstu}', '${su_sugges}', '${com_id}', '${tea_id}');`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 200,
                    message: `Successfully `,
                });
            }

        });

    });
}
async function visionteaupdate(su_teaid, su_day, su_mon, su_year, su_time, su_daparment, su_mname, su_job, su_numstu, su_sugges) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

            Query = `UPDATE supertea SET su_day = '${su_day}', su_mon = '${su_mon}', su_year = '${su_year}', su_time = '${su_time}' ,
                                         su_daparment = '${su_daparment}', su_mname = '${su_mname}', su_job = '${su_job}', su_numstu = '${su_numstu}', su_sugges = '${su_sugges}'
                                         WHERE su_teaid = ${su_teaid}`

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
                message: `update supervision teacher ${su_teaid} Successfuly:`,
                id: results1.insertId,
            })

        });

    });
}

async function getsuperstu() {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`SELECT * FROM superstu 
                        INNER JOIN company ON company.com_id = superstu.com_id
                        INNER JOIN student ON student.Id  = superstu.Id  
                        WHERE superstu.is_deleted = 0`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: 'Do not have any supervision student!',
                });
            }

        });

    });
}
async function visionstuinsert(su_timein, su_timeout, su_holiday, su_time, su_work, su_sugges, com_id, Id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

                Query =`INSERT INTO superstu (su_timein, su_timeout, su_holiday, su_time, su_work, su_sugges, com_id, Id)
                        VALUES ('${su_timein}', '${su_timeout}', '${su_holiday}', '${su_time}', '${su_work}', '${su_sugges}', '${com_id}', '${Id}');`
                        
        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                pool.end();
                return resolve({
                    statusCode: 500,
                    message: `'error SQL Query นาจา! '${error}''`,
                });
            }

            if (results1.length > 0) { //results = ผลลัพธ์
                pool.end();
                return resolve({
                    statusCode: 200,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 200,
                    message: `Successfully `,
                });
            }

        });

    });
}
async function visionstuupdate(su_stuid, su_timein, su_timeout, su_holiday, su_time, su_work, su_sugges) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

            Query = `UPDATE superstu SET su_timein = '${su_timein}', su_timeout = '${su_timeout}', su_holiday = '${su_holiday}', su_time = '${su_time}' ,
                                         su_work = '${su_work}', su_sugges = '${su_sugges}'
                                         WHERE su_stuid = ${su_stuid}`

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
                message: `update supervision teacher ${su_work} Successfuly:`,
                id: results1.insertId,
            })

        });

    });
}

module.exports.supervisionRepo = {
    getsupercom: getsupercom,
    visioncominsert: visioncominsert,
    visioncomupdate: visioncomupdate,
    getsupertea: getsupertea,
    visionteainsert: visionteainsert,
    visionteaupdate: visionteaupdate,
    getsuperstu: getsuperstu,
    visionstuinsert: visionstuinsert,
    visionstuupdate: visionstuupdate,
  };
  