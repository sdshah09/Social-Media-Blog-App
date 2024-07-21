const {gql} = require('apollo-server-express');
const auth = require('../typeDefs/auth');
const { authCheck } = require('../helpers/auth'); // Ensure this is the correct path and named import
const User = require('../models/user')
// const { customAlphabet } = require('nanoid');
const me = async (parent, args, { req, res }) => {
    await authCheck(req, res);
    // console.log("Request in Auth server is: ",req.headers);
    return "Shaswat D Shah"; // Ensure this returns a non-null value
};

const userCreate = async(parent,args,{req})=>{
    const { customAlphabet } = await import('nanoid');

    const currentUser = await authCheck(req);
    const user = await User.findOne({email:currentUser.email})
    const alphabet = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
    const length = 8; // You can adjust the length as needed
    const generate = customAlphabet(alphabet,length) // autogenerates the username if not present
    console.log("Generate User is: ",user);
    return user ? user: new User({
        email: currentUser.email,
        username:generate()
    }).save()

}
module.exports = {
    Query: {
        me
    },
    Mutation: {
        userCreate
    }

};
