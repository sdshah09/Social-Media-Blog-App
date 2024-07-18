const {gql} = require('apollo-server-express');
const auth = require('../typeDefs/auth');
const { authCheck } = require('../helpers/auth'); // Ensure this is the correct path and named import

const me = async (parent, args, { req, res }) => {
    await authCheck(req, res);
    console.log("Request in Auth server is: ",req.headers);
    return "Shaswat D Shah"; // Ensure this returns a non-null value
};

module.exports = {
    Query: {
        me
    }
};
