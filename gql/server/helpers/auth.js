/*
**

* AFTER LOGIN/REGISTER WITH FIREBASE, SAVE THAT USER IN DATABASE

*...FROM OUR FIREBASE APP

* FOR THAT WE WILL SEND CURRENT USER'S ACCESS TOKEN TO OUR BACKEND

* USING FIREBASE ADMIN TOOL, WE WILL MAKE SURE THAT THE TOKEN IS GENERATED

* THIS IS KIND OF LIKE SERVER SIDE VALIDATION OF THE TOKEN

* IF IT IS VALID THEN... WE CAN BE SURE THAT WE HAVE A GENUINE USER

* SO WE WILL SAVE THAT USER TO DATABASE

* AT THAT POINT WE WILL START WITH GRAPHQL SCHEMA > RESOLVERS

* BEFORE IMPLEMENTING FIREBASE ADMIN TO OUR SERVER

* LETS WRITE SIMPLE AUTH LOGIC FIRST TO UNDERSTAND HOW IT WILL WORK
*/

var admin = require('firebase-admin')
var serviceAccount = require('../config/fbServiceAccountKey.json')

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
})
let authorized = true;

exports.authCheck = (req, res, next = (f) => f) => {
    console.log(req.headers.authtoken)
    if (!req.headers.authtoken) {
        // next();
        throw new Error("Unauthorized");
    } 
    const valid = req.headers.authtoken==='secret'
    if(!valid){
        throw new Error("Unauthorized")
    }
    else{
        next();
    }
    // else {
    //     throw new Error("Unauthorized");
    // }
};
