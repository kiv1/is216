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
        //Validate if token belongs to a user
        let user = await firebaseLL.verifyUser(Idtoken);
        if (!user) {
            res.status(401).send('UnAuthorised Request');
        }
        //Set token to cookie for future validation
        let response = await setCookie(Idtoken, res);
        if (response.statusCode == 401) {
            res.send('UnAuthorised Request');
        }
        //Check if user has setup at least one drive
        let result = await isSetupComplete(user.uid);
        if (!result) {
            //Go to setup page
            response.redirect('/user/setup');
        } else {
            //Go to dashboard
            response.redirect('/user/dashboard');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('An Unexpected Error occured');
    }
});

router.get('/setup', checkCookie, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/user', 'setup.html'), { dotfiles: 'allow' });
});

router.get('/demo', checkCookie, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/user', 'demo.html'), { dotfiles: 'allow' });
});

router.get('/dashboard', checkCookie, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/user', 'dashboard.html'), { dotfiles: 'allow' });
});

// // Saving cookies and verify cookies
// // Reference :
// //https://firebase.google.com/docs/auth/admin/manage-cookies

async function setCookie(idtoken, res) {
    try {
        let sessionCookie = await firebaseLL.createCookie(idtoken);
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.status(200);
        return res;
    } catch (err) {
        console.log(err);
        res.status(401);
        return res;
    }
}

async function isSetupComplete(userId) {
    return await firebaseLL.checkDocExists(userId, 'Settings');
}

function checkCookie(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    firebaseLL
        .getUser(sessionCookie)
        .then(async (decodedClaims) => {
            req.decodedClaims = decodedClaims;
            let result = await isSetupComplete(decodedClaims.uid);
            if (!result) {
                res.sendFile(path.join(__dirname, '../public/views/user', 'setup.html'), { dotfiles: 'allow' });
            } else if (req.route.path == '/' || req.route.path == '/setup') {
                res.sendFile(path.join(__dirname, '../public/views/user', 'dashboard.html'), { dotfiles: 'allow' });
            } else {
                next();
            }
        })
        .catch((error) => {
            console.log(error);
            res.sendFile(path.join(__dirname, '../public/views/user', 'login.html'), { dotfiles: 'allow' });
        });
}

module.exports = router;
