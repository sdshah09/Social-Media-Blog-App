const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");

// queries

const allPosts = async (parent, args) => {
  console.log("Args in All Posts is: ",args.page);
  const currentPage = args.page || 1;
  const perPage = 3;

  return await Post.find({})
    .skip((currentPage - 1) * perPage) // this is for pagination and currentpage - 1 because first page starts from 0-perPage
    .populate("postedBy", "_id username")
    .limit(perPage)
    .exec();
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

const singlePost = async (parent, args) => {
  return await Post.findById({ _id: args.postId })
    .populate("postedBy", "_id username")
    .exec();
};

const totalPosts = async (parent, args) =>
  await Post.find({}).estimatedDocumentCount().exec();
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

const postUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  // validation
  if (args.input.content.trim() === "") throw new Error("Content is required");
  // get current user mongodb _id based on email
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  // _id of post to update
  const postToUpdate = await Post.findById({ _id: args.input._id }).exec();
  // if currentuser id andid of the post's postedBy user id is same, allow update
  if (currentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString())
    throw new Error("Unauthorized user");
  let updatePost = await Post.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true }
  ).populate("postedBy", "_id username");

  return updatePost;
};

const postDelete = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  const postToDelete = await Post.findById({ _id: args.postId }).exec();
  if (currentUserFromDb._id.toString() !== postToDelete.postedBy._id.toString())
    throw new Error("Unauthorized user");
  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();
  return deletedPost;
};
module.exports = {
  Query: {
    allPosts,
    postByUser,
    singlePost,
    totalPosts,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
};
