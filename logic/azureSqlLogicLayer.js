const { Connection, Request } = require('tedious');
var TYPES = require('tedious').TYPES;

// Create connection to database
const config = {
    authentication: {
        options: {
            userName: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
        },
        type: 'default',
    },
    server: process.env.SQL_URL,
    options: {
        database: process.env.SQL_SCHEMA,
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
    },
};

const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.error(err.message);
    }
});
connection.connect();

async function getAllMods() {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * from Modules`, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                let result = [];
                rows.forEach((columns) => {
                    result.push({
                        id: columns[0].value,
                        name: columns[1].value,
                    });
                });
                resolve({
                    status: true,
                    result: result,
                });
            }
        });
        connection.execSql(request);
    });
}

async function getAllCourse() {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * FROM Course `, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                let result = [];
                rows.forEach((columns) => {
                    result.push({
                        id: columns[0].value,
                        name: columns[1].value,
                        schoolId: columns[2].value,
                    });
                });
                resolve({
                    status: true,
                    result: result,
                });
            }
        });
        connection.execSql(request);
    });
}

async function getAllSchool() {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * FROM School `, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                let result = [];
                rows.forEach((columns) => {
                    result.push({
                        id: columns[0].value,
                        name: columns[1].value,
                    });
                });
                resolve({
                    status: true,
                    result: result,
                });
            }
        });
        connection.execSql(request);
    });
}

async function getOneSchool(schoolId) {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * FROM School where ID = @id`, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                if (rowCount == 1) {
                    resolve({
                        status: true,
                        result: rowCount,
                    });
                } else {
                    resolve({
                        status: false,
                        result: 'No School was found',
                    });
                }
            }
        });
        request.addParameter('id', TYPES.VarChar, schoolId);

        connection.execSql(request);
    });
}

async function getOneCourse(courseId) {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * FROM Course where ID = @id`, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                if (rowCount == 1) {
                    resolve({
                        status: true,
                        result: rowCount,
                    });
                } else {
                    resolve({
                        status: false,
                        result: 'No Course was found',
                    });
                }
            }
        });
        request.addParameter('id', TYPES.VarChar, courseId);

        connection.execSql(request);
    });
}

async function getOneMod(modId) {
    return new Promise((resolve, reject) => {
        const request = new Request(`SELECT * FROM Modules where ID = @id`, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                if (rowCount == 1) {
                    resolve({
                        status: true,
                        result: rowCount,
                    });
                } else {
                    resolve({
                        status: false,
                        result: modId + ' was not found',
                    });
                }
            }
        });
        request.addParameter('id', TYPES.VarChar, modId);

        connection.execSql(request);
    });
}

async function insertUserProfile(user) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `INSERT INTO [User] (UID, TelegramHandle, School, Course) VALUES (@uid, @telegramHandle, @school, @course)`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, user.uid);
        request.addParameter('telegramHandle', TYPES.VarChar, user.telegramHandle);
        request.addParameter('school', TYPES.VarChar, user.school);
        request.addParameter('course', TYPES.VarChar, user.course);

        connection.execSql(request);
    });
}

async function insertUserProfile(user) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `INSERT INTO [User] (UID, Name, TelegramHandle, School, Course) VALUES (@uid, @name, @telegramHandle, @school, @course)`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, user.uid);
        request.addParameter('name', TYPES.VarChar, user.name);
        request.addParameter('telegramHandle', TYPES.VarChar, user.telegramHandle);
        request.addParameter('school', TYPES.VarChar, user.school);
        request.addParameter('course', TYPES.VarChar, user.course);

        connection.execSql(request);
    });
}

async function updateUserProfile(user) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `Update [User] set School = @school, Course = @course where uid = @uid`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, user.uid);
        request.addParameter('school', TYPES.VarChar, user.school);
        request.addParameter('course', TYPES.VarChar, user.course);

        connection.execSql(request);
    });
}

async function updateUserTelegram(uid, telegram) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `Update [User] set TelegramHandle = @telegram where uid = @uid`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        request.addParameter('telegram', TYPES.VarChar, telegram);

        connection.execSql(request);
    });
}

async function insertUserMods(userMod) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `INSERT INTO UserMods (UserID, ModId) VALUES (@uid, @modId)`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, userMod.uid);
        request.addParameter('modId', TYPES.VarChar, userMod.modId);

        connection.execSql(request);
    });
}

async function deleteUserMods(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(`DELETE FROM  UserMods where UserID = @uid`, (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                resolve({
                    status: false,
                    result: err.message,
                });
            } else {
                resolve({
                    status: true,
                    result: '',
                });
            }
        });
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function getUserMods(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT m.ID, m.Title FROM UserMods um INNER JOIN Modules m ON m.ID = um.ModId WHERE um.UserID = @uid`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    let result = [];
                    rows.forEach((columns) => {
                        result.push({
                            id: columns[0].value,
                            name: columns[1].value,
                        });
                    });
                    resolve({
                        status: true,
                        result: result,
                    });
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function getUserData(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT TelegramHandle, School, Course, name FROM [User] where UID = @uid`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        let result = [];
                        rows.forEach((columns) => {
                            result.push({
                                telegram: columns[0].value,
                                school: columns[1].value,
                                course: columns[2].value,
                                name: columns[3].value,
                            });
                        });
                        resolve({
                            status: true,
                            result: result,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 0,
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}
async function findRequest(uid, otherUID) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `Select * from [Request] where (UID = @uid and OtherUID = @otherUID) or (UID = @otherUID and OtherUID = @uid)`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, otherUID);
        request.addParameter('otherUID', TYPES.VarChar, uid);

        connection.execSql(request);
    });
}

async function updateRequest(uid, otherUID) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `Update [Request] set isPending = 0 where UID = @uid and OtherUID = @otherUID`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, otherUID);
        request.addParameter('otherUID', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function getAllPendingRequestForAction(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT  u.UID, u.Name, s.Name, c.Name FROM [User] u, School s , Course c
            where UID <> @uid
            and UID IN (SELECT UID FROM Request where OtherUid = @uid and isPending = 1) 
            and u.School = s.ID 
            and u.Course = c.ID `,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    let result = [];
                    rows.forEach((columns) => {
                        result.push({
                            uid: columns[0].value,
                            name: columns[1].value,
                            school: columns[2].value,
                            course: columns[3].value,
                            isPendingUserAction: true,
                        });
                    });
                    resolve({
                        status: true,
                        result: result,
                    });
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function getAllPendingRequestForNoAction(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT  u.UID, u.Name, s.Name, c.Name FROM [User] u, School s , Course c
            where UID <> @uid
            and UID IN (SELECT otherUID FROM Request where UID = @uid and isPending = 1) 
            and u.School = s.ID 
            and u.Course = c.ID `,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    let result = [];
                    rows.forEach((columns) => {
                        result.push({
                            uid: columns[0].value,
                            name: columns[1].value,
                            school: columns[2].value,
                            course: columns[3].value,
                            isPendingUserAction: false,
                        });
                    });
                    resolve({
                        status: true,
                        result: result,
                    });
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function getAllAcceptedRequest(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT  u.UID, u.Name, u.TelegramHandle, s.Name, c.Name FROM [User] u, School s , Course c
            where UID <> @uid
            and (UID IN (SELECT UID FROM Request where OtherUid = @uid and isPending = 0) 
            or UID IN (SELECT OtherUID FROM Request where UID =  @uid and isPending = 0))
            and u.School = s.ID 
            and u.Course = c.ID `,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    let result = [];
                    rows.forEach((columns) => {
                        result.push({
                            uid: columns[0].value,
                            name: columns[1].value,
                            telegram: columns[2].value,
                            school: columns[3].value,
                            course: columns[4].value,
                        });
                    });
                    resolve({
                        status: true,
                        result: result,
                    });
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

async function insertRequest(uid, otherUID) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `INSERT INTO [Request] (UID, OtherUID, isPending) VALUES (@uid, @otherUID, 1)`,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    if (rowCount == 1) {
                        resolve({
                            status: true,
                            result: rowCount,
                        });
                    } else {
                        resolve({
                            status: false,
                            result: 'Something went wrong! Please try again!',
                        });
                    }
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        request.addParameter('otherUID', TYPES.VarChar, otherUID);

        connection.execSql(request);
    });
}

async function getAllUsers(uid) {
    return new Promise((resolve, reject) => {
        const request = new Request(
            `SELECT  u.UID, u.Name, s.Name, c.Name FROM [User] u, School s , Course c
            where UID <> @uid
            and UID NOT IN (SELECT UID FROM Request where OtherUid = @uid) 
            and UID NOT IN (SELECT OtherUID FROM Request where UID =  @uid)
            and u.School = s.ID 
            and u.Course = c.ID `,
            (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    resolve({
                        status: false,
                        result: err.message,
                    });
                } else {
                    let result = [];
                    rows.forEach((columns) => {
                        result.push({
                            uid: columns[0].value,
                            name: columns[1].value,
                            school: columns[2].value,
                            course: columns[3].value,
                        });
                    });
                    resolve({
                        status: true,
                        result: result,
                    });
                }
            }
        );
        request.addParameter('uid', TYPES.VarChar, uid);
        connection.execSql(request);
    });
}

module.exports = {
    getAllMods,
    getAllCourse,
    getAllSchool,
    getOneSchool,
    getOneCourse,
    getOneMod,
    insertUserProfile,
    insertUserMods,
    getUserData,
    getAllUsers,
    getUserMods,
    updateUserProfile,
    deleteUserMods,
    updateUserTelegram,
    insertRequest,
    findRequest,
    updateRequest,
    getAllPendingRequestForAction,
    getAllPendingRequestForNoAction,
    getAllAcceptedRequest,
};
