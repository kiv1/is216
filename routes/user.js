const express = require('express');
var path = require('path');
var router = express.Router();
const firebaseLL = require('../logic/firebaseLogicLayer.js');

router.get('/', checkCookie, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/user', 'login.html'), { dotfiles: 'allow' });
});

router.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/user');
});

router.get('/savecookie', async (req, res) => {
    try {
        const Idtoken = req.query.idToken;
        setCookie(Idtoken, res);
    } catch (err) {
        console.log(err);
        res.status(500).send('An Unexpected Error occured');
    }
});

router.get('/demo', checkCookie, (req, res) => {
    console.log('UID of Signed in User is' + req.decodedClaims.uid);
    res.sendFile(path.join(__dirname, '../public/views/user', 'demo.html'), { dotfiles: 'allow' });
});

// // Saving cookies and verify cookies
// // Reference :
// //https://firebase.google.com/docs/auth/admin/manage-cookies

async function setCookie(idtoken, res) {
    try {
        let user = await firebaseLL.verifyUser(idtoken);
        if (!user) {
            throw 'UnAuthorised Request';
        }
        await firebaseLL.addUserSetting(user.user_id);
        let sessionCookie = await firebaseLL.createCookie(idtoken);
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.redirect('/user/demo');
    } catch (err) {
        console.log(err);
        res.status(401).send('UnAuthorised Request');
    }
}

function checkCookie(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    firebaseLL
        .getUser(sessionCookie)
        .then(decodedClaims => {
            req.decodedClaims = decodedClaims;
            if (req.route.path == '/') {
                res.redirect('/user/demo');
            }
            next();
        })
        .catch(error => {
            console.log(error);
            res.sendFile(path.join(__dirname, '../public/views/user', 'login.html'), { dotfiles: 'allow' });
        });
}

module.exports = router;
