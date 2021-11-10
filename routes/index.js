var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/home', 'index.html'), { dotfiles: 'allow' });
});

router.get('/places', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/home', 'places.html'), { dotfiles: 'allow' });
});

router.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/home', 'weather.html'), { dotfiles: 'allow' });
});

module.exports = router;
