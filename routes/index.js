var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/home', 'index.html'), { dotfiles: 'allow' });
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/home', 'about.html'), { dotfiles: 'allow' });
});

module.exports = router;
