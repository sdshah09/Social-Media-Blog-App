const User = require('../models/user');

const userCreate = async (parent, args, context) => {
  const { customAlphabet } = await import('nanoid');

  try {
    const { email } = args;

    if (!email) {
      throw new Error("Email is required");
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists");
      
    }   

    // Generate a unique username
    const alphabet = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
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

const me = async (parent, args, { req, res }) => {
  await authCheck(req, res);
  return "Shaswat D Shah";
};

const resolvers = {
  Query: {
    me,
  },
  Mutation: {
    userCreate,
  },
};

module.exports = resolvers;
