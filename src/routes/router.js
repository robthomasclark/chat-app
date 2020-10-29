var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Chat App' });
});

/* GET chat page. */
router.get('/chat', (req, res, next) => {
  res.render('chat', { title: 'Chat App' });
});

router.get('*', (req, res, next) => {
  res.render('error', { message: "Error",
  status: "401 not found"})
})

module.exports = router;
