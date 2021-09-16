var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var path = require('path');
const firebaseLL = require('../logic/firebaseLogicLayer.js');

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

router.get('/GetBio', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let bio = await firebaseLL.getBio(user.user_id);
        res.send({ bioData: bio });
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

router.post('/UpdateBio', async (req, res) => {
    const sessionCookie = req.cookies.session;
    try {
        let user = await firebaseLL.getUser(sessionCookie);
        let newBio = req.body.bio;
        await firebaseLL.updateBio(user.user_id, newBio);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
});

module.exports = router;
