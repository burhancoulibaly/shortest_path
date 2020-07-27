const { sign, verify } = require('jsonwebtoken');

const createAccessToken = (email, username,tokenVersion) => {
    return sign({ email: email, username: username, tokenVersion: tokenVersion }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const createRefreshToken = (email, username, tokenVersion) => {
    return sign({ email: email, username: username, tokenVersion: tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

//All errors functions below return will be jwt token errors.
const authenticateUser = async (req, res, next) => {
    // console.log(req.headers["authorization"]);
    const authorization = req.headers["authorization"];

    //User authentication logic here.

    return next();
}

const refreshToken = function(refreshToken, response){
    return new Promise(async(resolve, reject) => {
        //refresh token logic here.
    })
}

const deleteToken = function(res){
    return new Promise(async(resolve, reject) => {
        //delete token logic here.
    })
}

const revokeToken = function(email){
    return new Promise(async(resolve, reject) => {
        //revoke token logic here
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    authenticateUser,
    revokeToken,
    refreshToken,
    deleteToken
}
