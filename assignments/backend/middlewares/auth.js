const jwt = require('jsonwebtoken');

require("dotenv").config();

const authorization = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        try {
            if (err) {
                res.send({ "ok": false, "msg": "Please Login First" });
                return;
            }
            if (decoded) {
                next();
            } else {
                res.send({ "ok": false, "msg": "Please Login First" });
            }

        } catch (error) {
            console.log(error);
            res.status(400).send({ "ok": false, "msg": "Something went wrong with middleware" })
        }
    });
}

module.exports = {
    authorization
}