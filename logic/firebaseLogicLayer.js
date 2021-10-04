const admin = require('firebase-admin');
const https = require('https');
const fs = require('fs');
var path = require('path');

const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const API_KEY = process.env.API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;
const APP_ID = process.env.APP_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

var key = PRIVATE_KEY;

admin.initializeApp({
    credential: admin.credential.cert({
        private_key: key.replace(/\\n/g, '\n'),
        client_email: CLIENT_EMAIL,
        project_id: PROJECT_ID,
    }),
});
const database = admin.firestore();

function getGoogleData() {
    return {
        authDomain: AUTH_DOMAIN,
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        msgSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
    };
}

async function addDriveUserSetting(userId, driveObj, driveName) {
    let usersCollection = await database.collection(userId);
    let result = await checkDocExists(userId, 'Settings');
    let userSetting = usersCollection.doc('Settings');
    if (!result) {
        await userSetting.set({ driveCollection: [driveName] });
        return await userSetting.update(driveObj);
    } else {
        let collection = await getUserAvailable(userId);
        if (!collection.includes(driveName)) {
            collection.push(driveName);
        }
        await userSetting.update({ driveCollection: collection });
        return await userSetting.update(driveObj);
    }
}

async function getDriveProperties(userId, drive) {
    let doc = await database.collection(userId).doc('Settings').get();
    let driveProperties = doc.get(drive);
    return driveProperties;
}

async function getUserAvailableDrives(userId) {
    let doc = await database.collection(userId).doc('Settings').get();
    let driveCollection = doc.get('driveCollection');
    let driveSetting = [];
    driveCollection.forEach((element) => {
        driveSetting.push(doc.get(element));
    });
    let driveSettingCollection = {
        driveCollection: driveCollection,
        driveSetting: driveSetting,
    };
    return driveSettingCollection;
}

async function checkDocExists(userId, documentName) {
    let usersCollection = database.collection(userId);
    let doc = await usersCollection.doc(documentName).get();
    return doc.exists;
}

async function createCookie(idToken) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    return await admin.auth().createSessionCookie(idToken, { expiresIn });
}
async function verifyUser(idToken) {
    return await admin.auth().verifyIdToken(idToken);
}
async function getUser(sessionToken) {
    return await admin.auth().verifySessionCookie(sessionToken, true);
}
module.exports = {
    getGoogleData,
    createCookie,
    verifyUser,
    getUser,
    checkDocExists,
    getDriveProperties,
    getUserAvailableDrives,
    addDriveUserSetting,
};
