var express = require('express');
var router = express.Router();
var { isAdmin  } = require('./logres'); 

router.get('/', isAdmin, (req, res) => {
    res.render('master', {
        success: req.query.success || null,
        error: req.query.error || null
        });
    });
    


module.exports = router;
