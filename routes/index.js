var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/loginRegister', function(req, res, next) {
  res.render('../public/loginRegister');
});
router.get('/crearSala', function(req, res, next) {
  res.render('../public/crearSala');
});

module.exports = router;
