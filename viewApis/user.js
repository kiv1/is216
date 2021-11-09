var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var path = require('path');
const firebaseLL = require('../logic/firebaseLogicLayer.js');
const azureLL = require('../logic/azureSqlLogicLayer.js');
const telegramLL = require('../logic/telegramLogicLayer.js');
const { resolve } = require('path');
const { rejects } = require('assert');
const { exit } = require('process');

router.get('/GetGoogleAPI', (req, res) => {
    res.send(process.env.GOOGLE_API_KEY)
})

router.get('/GetGoogleData', (req, res) => {
    res.send(firebaseLL.getGoogleData());
});

router.get('/GetUserData', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        res.send({
            name: user.name,
            email: user.email,
            picture: user.picture,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/SetProfile', async (req, res) => {
    const sessionCookie = req.cookies.session;
    let handle = req.body.handle;
    let school = req.body.school.toString();
    let course = req.body.course;
    let mods = req.body.mods;
    try {
        let user = await firebaseLL.getUser(sessionCookie);

        let snapshot = await firebaseLL.getOtp(user.uid);
        if (snapshot.val() != null) {
            if (!snapshot.val().verified) {
                res.status(401).send({ result: false, msg: 'Telegram handle has not been verified' });
                return;
            }
        } else {
            res.status(401).send({ result: false, msg: 'Telegram handle has not been verified' });
            return;
        }
        let schoolResult = await azureLL.getOneSchool(school);
        if (!schoolResult.status) {
            res.status(401).send({ result: false, msg: schoolResult.result });
            return;
        }
        let courseResult = await azureLL.getOneCourse(course);
        if (!courseResult.status) {
            res.status(401).send({ result: false, msg: courseResult.result });
            return;
        }
        if (mods.length < 4) {
            res.status(401).send({ result: false, msg: 'You need to choose at least 4 modules' });
            return;
        }
        for (let index = 0; index < mods.length; index++) {
            const element = mods[index];
            let modResult = await azureLL.getOneMod(element.id);
            if (!modResult.status) {
                res.status(401).send({ result: false, msg: modResult.result });
                return;
            }
        }
        // Insert into db here!
        let userObj = {
            uid: user.uid,
            name: user.name,
            telegramHandle: handle,
            school: school,
            course: course,
        };
        let insertUserResult = await azureLL.insertUserProfile(userObj);
        if (insertUserResult.status) {
            let userModObj = {
                uid: user.uid,
                modId: '',
            };
            let errorMods = [];
            for (let index = 0; index < mods.length; index++) {
                const element = mods[index];
                userModObj.modId = element.id;
                let userModResult = await azureLL.insertUserMods(userModObj);
                if (!userModResult.status) {
                    errorMods.push(element.id);
                }
            }
            if (errorMods.length > 0) {
                res.status(401).send(
                    'The following modules could not be added:' + errorMods.join(', ') + ' Please try again!'
                );
                return;
            } else {
                res.status(200).send({
                    result: true,
                });
                return;
            }
        } else {
            res.status(401).send(insertUserResult.result);
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/UpdateProfile', async (req, res) => {
    const sessionCookie = req.cookies.session;
    let school = req.body.school.toString();
    let course = req.body.course;
    let mods = req.body.mods;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let schoolResult = await azureLL.getOneSchool(school);
        if (!schoolResult.status) {
            res.status(401).send({ result: false, msg: schoolResult.result });
            return;
        }
        let courseResult = await azureLL.getOneCourse(course);
        if (!courseResult.status) {
            res.status(401).send({ result: false, msg: courseResult.result });
            return;
        }
        for (let index = 0; index < mods.length; index++) {
            const element = mods[index];
            let modResult = await azureLL.getOneMod(element.id);
            if (!modResult.status) {
                res.status(401).send({ result: false, msg: modResult.result });
                return;
            }
        }
        let userObj = {
            uid: user.uid,
            school: school,
            course: course,
        };
        let updateUserResult = await azureLL.updateUserProfile(userObj);
        if (updateUserResult.status) {
            await azureLL.deleteUserMods(user.uid);
            let userModObj = {
                uid: user.uid,
                modId: '',
            };
            let errorMods = [];
            for (let index = 0; index < mods.length; index++) {
                const element = mods[index];
                userModObj.modId = element.id;
                let userModResult = await azureLL.insertUserMods(userModObj);
                if (!userModResult.status) {
                    errorMods.push(element.id);
                }
            }
            if (errorMods.length > 0) {
                res.status(401).send(
                    'The following modules could not be added:' + errorMods.join(', ') + ' Please try again!'
                );
                return;
            } else {
                res.status(200).send({
                    result: true,
                });
                return;
            }
        } else {
            res.status(401).send(insertUserResult.result);
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetAllUserSetting', async (req, res) => {
    try {
        let mods = await azureLL.getAllMods();
        let course = await azureLL.getAllCourse();
        let school = await azureLL.getAllSchool();

        res.send({
            mods: mods.result,
            course: course.result,
            school: school.result,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetAllUsers', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let user = await firebaseLL.getUser(sessionCookie);
        let allUsers = await azureLL.getAllUsers(user.uid);
        let toReturn = [];
        let userMods = await azureLL.getUserMods(user.uid);

        for (let index = 0; index < allUsers.result.length; index++) {
            const element = allUsers.result[index];
            let temp = element;
            let oneR = await azureLL.getUserMods(element.uid);
            temp.mods = oneR.result;
            let count = 0;
            userMods.result.forEach((element) => {
                if (temp.mods.filter((e) => e.id == element.id).length == 1) {
                    count++;
                }
            });
            temp.similarity = Math.round((count / userMods.result.length) * 100);
            toReturn.push(temp);
        }
        res.send({
            users: toReturn,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetAllPendingRequest', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let user = await firebaseLL.getUser(sessionCookie);
        let allPendingAction = await azureLL.getAllPendingRequestForAction(user.uid);
        let allPendingNoAction = await azureLL.getAllPendingRequestForNoAction(user.uid);
        let allAcceptedRequest = await azureLL.getAllAcceptedRequest(user.uid);

        let toReturn = [];
        let accepted = [];
        let userMods = await azureLL.getUserMods(user.uid);

        for (let index = 0; index < allPendingAction.result.length; index++) {
            const element = allPendingAction.result[index];
            let temp = element;
            let oneR = await azureLL.getUserMods(element.uid);
            temp.mods = oneR.result;
            let count = 0;
            userMods.result.forEach((element) => {
                if (temp.mods.filter((e) => e.id == element.id).length == 1) {
                    count++;
                }
            });
            temp.similarity = Math.round((count / userMods.result.length) * 100);
            toReturn.push(temp);
        }

        for (let index = 0; index < allPendingNoAction.result.length; index++) {
            const element = allPendingNoAction.result[index];
            let temp = element;
            let oneR = await azureLL.getUserMods(element.uid);
            temp.mods = oneR.result;
            let count = 0;
            userMods.result.forEach((element) => {
                if (temp.mods.filter((e) => e.id == element.id).length == 1) {
                    count++;
                }
            });
            temp.similarity = Math.round((count / userMods.result.length) * 100);
            toReturn.push(temp);
        }

        for (let index = 0; index < allAcceptedRequest.result.length; index++) {
            const element = allAcceptedRequest.result[index];
            let temp = element;
            let oneR = await azureLL.getUserMods(element.uid);
            temp.mods = oneR.result;
            let count = 0;
            userMods.result.forEach((element) => {
                if (temp.mods.filter((e) => e.id == element.id).length == 1) {
                    count++;
                }
            });
            temp.similarity = Math.round((count / userMods.result.length) * 100);
            accepted.push(temp);
        }
        console.log(allAcceptedRequest);
        res.send({
            users: toReturn,
            buddy: accepted,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetUserProfile', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let user = await firebaseLL.getUser(sessionCookie);
        let userProfile = await azureLL.getUserData(user.uid);
        let userMods = await azureLL.getUserMods(user.uid);
        res.send({
            user: userProfile.result[0],
            mods: userMods.result,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/CheckTelegramHandle', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let handle = req.body.handle;
        let user = await firebaseLL.getUser(sessionCookie);
        let snapshot = await firebaseLL.getOtp(user.uid);
        if (snapshot.val() != null) {
            let now = new Date();
            let lastTimeStamp = new Date(snapshot.val().dateTime);
            let diffMs = Math.abs(now - lastTimeStamp);
            let diffInMin = diffMs / 60000;
            if (diffInMin < 2) {
                res.status(401).send({
                    result: false,
                    msg: 'Please wait for 2 minutes before sending another request',
                });
                return;
            }
        }
        let otp = makeid(4);
        let result = await telegramLL.sendOTP(handle, otp);
        if (!result) {
            res.status(401).send({ result: false, msg: 'Telegram username cannot be found.' });
            return;
        } else {
            await firebaseLL.insertOtp(user.uid, otp);
            res.status(200).send({
                result: true,
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
        return;
    }
});

router.post('/VerifyOTP', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let handle = req.body.handle;
        let otp = req.body.otp;

        let user = await firebaseLL.getUser(sessionCookie);
        let snapshot = await firebaseLL.getOtp(user.uid);
        if (snapshot.val() != null) {
            let now = new Date();
            let lastTimeStamp = new Date(snapshot.val().dateTime);
            let diffMs = Math.abs(now - lastTimeStamp);
            let diffInMin = diffMs / 60000;
            if (diffInMin < 2 && otp == snapshot.val().otp) {
                await firebaseLL.setOtpVerified(user.uid);
                let result = await azureLL.getUserData(user.uid);
                if (result.status) {
                    await azureLL.updateUserTelegram(user.uid, handle);
                }
                res.status(200).send({
                    result: true,
                });
                return;
            }
        } else {
            res.status(401).send({ result: false, msg: 'No OTP was found.' });
            return;
        }
        otp = makeid(4);
        let result = await telegramLL.sendOTP(handle, otp);
        if (!result) {
            res.status(401).send({ result: false, msg: 'Telegram username cannot be found.' });
            return;
        } else {
            await firebaseLL.insertOtp(user.uid, otp);
            res.status(401).send({
                result: false,
                msg: 'OTP is incorrect or has expired. We have sent you a new one',
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
        return;
    }
});

router.post('/Connect', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        let uidToConnect = req.body.uid;
        let otherUser = await azureLL.getUserData(uidToConnect);
        if (!otherUser.status) {
            res.status(401).send({
                result: false,
                msg: 'User cannot be found',
            });
            return;
        } else {
            let user = await firebaseLL.getUser(sessionCookie);
            let userProfile = await azureLL.getUserData(user.uid);
            let foundRequest = await azureLL.findRequest(user.uid, uidToConnect);
            if (foundRequest.status) {
                await telegramLL.sendConfirmation(
                    otherUser.result[0].telegram,
                    userProfile.result[0].name,
                    userProfile.result[0].telegram
                );
                await telegramLL.sendConfirmation(
                    userProfile.result[0].telegram,
                    otherUser.result[0].name,
                    otherUser.result[0].telegram
                );
                await azureLL.updateRequest(user.uid, uidToConnect);
                res.status(200).send({
                    result: true,
                });
            } else {
                await azureLL.insertRequest(user.uid, uidToConnect);
                await telegramLL.sendRequest(otherUser.result[0].telegram);
                res.status(200).send({
                    result: true,
                });
            }
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
        return;
    }
});

function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
