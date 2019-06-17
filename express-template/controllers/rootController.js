require('dotenv').config();
const
  debug = require('debug')('example'),
  express = require('express'),
  router = express.Router();

router.get('/', async (req, res) => {
  //req.app.db.collection...
  res.render('home')
});

module.exports = router
