var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var path = require('path');
const firebaseLL = require('../logic/firebaseLogicLayer.js');
const googleLL = require('../logic/googleDriveLogicLayer.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

router.get('/CheckGoogleFile', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let result = await googleLL.checkFileReady(user.email);
        if (result.status) {
            result.msg = '';
            res.status(200).send(result);
        } else {
            res.status(406).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/SetGoogleFile', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let result = await googleLL.checkFileReady(user.email);
        if (result.status) {
            let drive = {
                gdrive: result.msg,
            };
            await firebaseLL.addDriveUserSetting(user.uid, drive, 'gdrive');
            res.status(200).send();
        } else {
            res.status(406).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/GetGoogleDriveId', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let result = await googleLL.checkFileReady(user.email);
        if (result.status) {
            let drive = {
                gdrive: result.msg,
            };
            await firebaseLL.addDriveUserSetting(user.uid, drive, 'gdrive');
            res.status(200).send();
        } else {
            res.status(406).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetDriveAvailable', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let result = await firebaseLL.getUserAvailableDrives(user.uid);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.get('/GetAllFilesFromDrive', async (req, res) => {
    const driveId = req.query.driveId;
    const drive = req.query.drive;
    try {
        if (drive == 'gdrive') {
            let result = await googleLL.getFilesInFolder(driveId);
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/CreateNewFolder', async (req, res) => {
    console.log('---------------------');
    let drive = req.body.drive;
    let driveId = req.body.folderId;
    let folderName = req.body.newFolderName;
    console.log(drive);
    console.log(driveId);
    console.log(folderName);
    console.log('---------------------');
    try {
        if (drive == 'gdrive') {
            let result = await googleLL.createFolder(folderName, driveId);
            console.log(result);
            res.status(200).send();
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/file-upload', upload.single('file'), async (req, res) => {
    const driveId = req.query.driveId;
    const drive = req.query.drive;
    console.log("Route: '/file-upload' ");
    console.log(driveId);
    console.log(drive);
    console.log('File upload request from user: ');
    console.log(req.file);
    try {
        let result = await googleLL.createFile(req.file, driveId);
        if (result.status === 200) {
            res.status(200).send();
        } else {
            res.status(404).send('Bad Request');
        }
    } catch (err) {
        console.log(err);
        res.status(404).send('Bad Request');
    }
    // Get a file handle, read the file and then write it out to the file system.
});
module.exports = router;
