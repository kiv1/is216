const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { file } = require('googleapis/build/src/apis/file');
var https = require('https');

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive';

let keyFile = process.env.GOOGLE_JSON_PATH;
const path = `${__dirname}/file.json`;

try {
    if (!fs.existsSync(path)) {
        https.get(keyFile, (res) => {
            // Image will be stored at this path
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on('finish', () => {
                filePath.close();
                console.log('Download Completed');
            });
        });
    }
} catch (err) {
    console.error(err);
}

const auth = new GoogleAuth({
    keyFile: path,
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: SCOPES,
});

const driveService = google.drive({
    version: 'v3',
    auth,
});

async function getFilesInFolder(id) {
    try {
        let result = await driveService.files.list({
            q: "'" + id + "' in parents",
            pageSize: 1000,
            fields: 'files(id, name, mimeType, webContentLink, thumbnailLink, iconLink)',
        });
        let files = result.data.files;
        console.log(files);
        return files;
    } catch (err) {
        return err;
    }
}

async function checkFileReady(email) {
    let result = await driveService.files.list({
        q: "'" + email + "' in owners and mimeType = 'application/vnd.google-apps.folder'",
        pageSize: 1000,
        orderBy: 'createdTime',
        kind: 'drive#folder',
        fields: 'files(id, name, capabilities, parents)',
    });

    let statusResult = {
        status: true,
        msg: '',
    };
    let files = result.data.files.filter((element) => element.parents == undefined);
    if (files.length > 1) {
        statusResult.msg = 'You have shared more than one file! Do revoke one of your folder!';
        statusResult.status = false;
    } else if (files.length == 1) {
        let file = files[0];
        if (file.capabilities.canEdit) {
            statusResult.msg = file.id;
            statusResult.status = true;
        } else {
            statusResult.msg = 'Editor permission is not given!';
            statusResult.status = false;
        }
    } else {
        statusResult.msg = 'No files was shared!';
        statusResult.status = false;
    }
    return statusResult;
}

async function createFolder(fileName, folderId) {
    var fileMetadata = {
        name: fileName,
        parents: [folderId],
        mimeType: 'application/vnd.google-apps.folder',
    };
    return await driveService.files.create({
        resource: fileMetadata,
        fields: 'id',
    });
}

async function createFile(file, folderId) {
    var fileMetadata = {
        name: file.originalname,
        parents: [folderId],
    };
    var media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };
    return await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });
}

module.exports = { getFilesInFolder, checkFileReady, createFolder, createFile };
