const resolver = require("./resolvers/resolver.js");

const admin = require("firebase-admin"),
      { hash, genSalt, compareSync } = require('bcrypt'),
      { config } = require('./config/config.js'),
      serviceAccount = config;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function login(username, password){
    return new Promise(async (resolve, reject) => {
        try {
            let snapshot = await db.collection('login').doc(username).get();
            let response = snapshot.data();

            if(!password && response){
                throw new Error("Username already exist");
            }else if(!password && !response){
                return resolve([true, 0]);
            }
    
            if (compareSync(password, response.password)){
                return resolve([true, response.token_version]);
            }else{
                throw new Error("Invalid Login");
            }
        } catch (error) {
            return reject(error);
        }
    });
}

function register(username, f_name, l_name, email, password){
    return new Promise(async (resolve, reject) => {
        try {
            const saltRounds = 12;
            const salt = await genSalt(saltRounds);
            const hashedPassword = await hash(password,salt);
            const tokenVersion = 0;

            let userRef = db.collection('user').doc(username);
            let loginRef = db.collection('login').doc(username);

            await userRef.set({
                email: `${email}`,
                f_name: `${f_name}`,
                l_name: `${l_name}`,
                username: `${username}`
            })

            await loginRef.set({
                password: `${hashedPassword}`,
                token_version: `${tokenVersion}`
            })

            return resolve([true, tokenVersion]);
        } catch (error) {
            return reject(error);
        }
    });
}

async function refreshToken(payload){
    return new Promise(async(resolve, reject) => {
        try{
            //Since token is valid a new accessToken is returned;
            let loginSnapshot = await db.collection('login').doc(payload.username).get();
            let loginResponse = loginSnapshot.data();

            if(!loginResponse){
                throw new Error("Invalid user");
            }

            if(payload.tokenVersion != loginResponse.token_version){
                throw new Error("Invalid token");
            }
            
            return resolve([{ 
                response_type: `Token refreshed`, 
                username: `${payload.username}`, 
                accessToken: ``
            }, payload.username, loginResponse.token_version]);
        }catch(error){
            return reject({ 
                response_type: error.toString().split(":")[0].replace(" ",""),
                response: error.toString().split(":")[1].replace(" ",""),
                accessToken: ``
            });
        }
    })
}

function revokeTokens(email){
    return new Promise(async(resolve, reject) => {
        //revoke token logic here
        try {
            let username;

            let userSnapshot = await db.collection('user').get();

            for(let i = 0; userSnapshot.docs.length; i++){
                if(userSnapshot.docs[i].data().email == email){
                    username = userSnapshot.docs[i].data().username;
                    break;
                }
            }

            let loginSnapshot = await db.collection('login').doc(username).get();
            let loginResponse = loginSnapshot.data();

            let loginRef = await db.collection('login').doc(username);

            await loginRef.update({
                token_version: ++loginResponse.token_version
            })

            return resolve({
                response_type: "Success",
                response: "User tokens Revoked"
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
    login,
    register,
    revokeTokens,
    refreshToken
}