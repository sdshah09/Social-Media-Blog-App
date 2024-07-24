const User = require("../models/user");
const { authCheck } = require("../helpers/auth");
const {DateTimeResolver} = require('graphql-scalars')

const userCreate = async (parent, args, context) => {
  try {
    const { email } = args;

    if (!email) {
      throw new Error("Email is required");
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, return the existing user
      return {
        username: user.username,
        email: user.email,
      };
    }

    // Generate a unique username
    const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
    const generate = customAlphabet(alphabet, 8);
    const username = generate();

    // Create a new user
    const newUser = new User({
      email,
      username,
    });

    const savedUser = await newUser.save();
    console.log("New user created:", savedUser);

    return {
      username: savedUser.username,
      email: savedUser.email,
    };
  } catch (error) {
    console.error("Error in userCreate:", error);
    throw new Error("User creation failed: " + error.message);
  }
};

const userUpdate = async (parent, args, { req }) => {
  console.log("Args input is: ",args.input);
  // console.log("User update request headers are: ",req.headers);
  const currentUser = await authCheck(req);
  const updateUser = await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec(); // new true sends the new data to the frontend
  return updateUser;
};

const profile = async (parent, args, { req}) => {
  const currentUser = await authCheck(req);
  return await User.findOne({email:currentUser.email}).exec();
};

const resolvers = {
  Query: {
    profile,
  },
  Mutation: {
    userCreate,
    userUpdate,
  },
};

module.exports = resolvers;
