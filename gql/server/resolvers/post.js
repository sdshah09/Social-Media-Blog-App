const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");

// queries

const allPosts = async (parent, args) => {
  return await Post.find({}).populate("postedBy", "_id username").exec();
};

const postByUser = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  return await Post.find({ postedBy: currentUserFromDb })
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 });
};
// mutation
const postCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  // validation
  if (args.input.content.trim() === "") throw new Error("Content is required");

  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  });

  let newPost = new Post({
    ...args.input,
    postedBy: currentUserFromDb._id,
  });

  newPost = await newPost.save();
  newPost = await Post.populate(newPost, {
    path: "postedBy",
    select: "_id username",
  });

  return newPost;
};

module.exports = {
  Query: {
    allPosts,
    postByUser
  },
  Mutation: {
    postCreate,
  },
};
