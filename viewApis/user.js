var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var path = require('path');
const firebaseLL = require('../logic/firebaseLogicLayer.js');

router.get('/GetGoogleData', (req, res) => {
    res.send(firebaseLL.getGoogleData());
});

router.get('/GetUserData', (req, res) => {
    const sessionCookie = req.cookies.session;
    firebaseLL
        .getUser(sessionCookie)
        .then(decodedClaims => {
            res.send({
                name: decodedClaims.name,
                email: decodedClaims.email,
                picture: decodedClaims.picture,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(401).send('UnAuthorised Request');
        });
});

module.exports = router;
