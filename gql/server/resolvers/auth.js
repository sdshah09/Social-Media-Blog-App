const { gql } = require('apollo-server-express');
const shortid = require('shortid');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const { DateTimeResolver } = require('graphql-scalars');

const profile = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    return await User.findOne({ email: currentUser.email }).exec();
};

const publicProfile = async(parent,args,{req})=>{
  return await User.findOne({username:args.username}).exec()
}

const allUsers = async(parent,args)=> await User.find({}).exec();

const userCreate = async (parent, args, { req }) => {
  // if(!req){

  // }
  console.log("Request method is: ",req.method);
  console.log("Args in usercreate is: ",args.email);
  const currentUser = await authCheck(req);
  console.log("Current user in userCreate is: ",currentUser);
  const user = await User.findOne({ email: args.email });

  if (user) {
    return user;
  }

  // Dynamically import customAlphabet from nanoidz
  const { customAlphabet } = await import('nanoid');
  
  // Define the alphabet and generate a unique username
  const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
  const generate = customAlphabet(alphabet, 8);
  const username = generate();

  // Create a new user
  const newUser = new User({
    email: args.email,
    username: username,
  });

  const savedUser = await newUser.save();
  return savedUser;
};

const userUpdate = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    console.log(args);
    const updatedUser = await User.findOneAndUpdate(
        { email: currentUser.email },
        { ...args.input },
        { new: true }
    ).exec();
    return updatedUser;
};

module.exports = {
    Query: {
        profile,
        publicProfile,
        allUsers
    },
    Mutation: {
        userCreate,
        userUpdate
    }
};
