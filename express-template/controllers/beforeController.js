require('dotenv').config();
const
  debug = require('debug')('example'),
  express = require('express'),
  router = express.Router();

router.use(async (req, res, next) => {
  // req.app.db.collection...
  next()
});

module.exports = router
