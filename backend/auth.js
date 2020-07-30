const { sign, verify } = require('jsonwebtoken'),
      db = require('./db');

const createAccessToken = (username, tokenVersion) => {
    return sign({ username: username, tokenVersion: tokenVersion }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1s" });
}

const createRefreshToken = (username, tokenVersion) => {
    return sign({ username: username, tokenVersion: tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

//All errors functions below return will be jwt token errors.
const authenticateUser = async (req, res, next) => {
    // console.log(req.headers["authorization"]);
    const authorization = req.headers["authorization"];

    //User authentication logic here.
    try{
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.payload = {
            response_type: authenticated,
            response: payload
        };
    }catch(error){
        if(error.toString().split(":")[1].replace(" ", "") == "jwt expired"){
            try {
                const token = (await refreshToken(req.cookies.jid, res)).accessToken;
                console.log(token);
                const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

                req.payload = {
                    response_type: "authenticated",
                    response: payload
                };
            } catch (error) {
                req.payload = {
                    response_type: error.toString().split(":")[0].replace(" ",""),
                    response: error.toString().split(":")[1].replace(" ","")
                };
            }

            return next();
        }
        
        req.payload = {
            response_type: error.toString().split(":")[0].replace(" ",""),
            response: error.toString().split(":")[1].replace(" ","")
        };
    }

    return next();
}

const refreshToken = async function(refreshToken, res){
    //refresh token logic here.
    try {
        payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        response = await db.refreshToken(payload);


        res.cookie('jid', createRefreshToken(response[1], response[2]), {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
            httpOnly: true,
            secure: true
            
        });

        response[0].accessToken = createAccessToken(response[1], response[2]);

        return response[0];
    } catch (error) {
        // console.log(error);
        return error;
    }
}

const revokeTokens = async function(email){
    try {
        response = await db.revokeTokens(email);

        return response;
    } catch (error) {
        return error;
    }
}

const deleteToken = function(res){
    return new Promise(async(resolve, reject) => {
        //delete token logic here.
        try {
            res.clearCookie('jid');

            return resolve({
                response_type: "Success",
                response: "jid cleared"
            });
        } catch (error) {
            return reject({
                response_type: error.toString().split(":")[0].replace(" ",""),
                response: error.toString().split(":")[1].replace(" ","")
            });
        }

    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    authenticateUser,
    revokeTokens,
    refreshToken,
    deleteToken
}
