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

var admin = require('firebase-admin');

var serviceAccount = require('../config/fbServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: 'https://gqlreactnode99.firebaseio.com'
});

exports.authCheck = async (req) => {
    try {
        if (!req.headers.authtoken) {
            console.log("No authtoken provided, skipping auth check");
            return null;
        }    
        console.log("Request headers in helpers are: ",req.headers);
        console.log("Authtoken is: ",req.headers.authtoken);
        const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        console.log('CURRENT USER', currentUser);
        return currentUser;
    } catch (error) {
        console.log('AUTH CHECK ERROR', error);
        throw new Error('Invalid or expired token');
    }
};
