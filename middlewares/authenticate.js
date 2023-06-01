const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.send({ "Message": "Please Login First" })
        
    }
    jwt.verify(token, process.env.key, function (err, decoded) {
        if (err) {
            res.send({ "Msg": "Please Login First", "err": err.message })
        } else {
            const userID = decoded.userID;
            req.body.userID = userID;
            next()
      }
    });
}

module.exports={auth}