const { authCheck } = require("../helpers/auth");
const Post = require("../models/post");
const User = require("../models/user");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const POST_ADDED = "POST_ADDED";
const POST_UPDATED = "POST_UPDATED";
const POST_DELETED = "POST_DELETED";

// Queries
const allPosts = async (parent, args) => {
  const currentPage = args.page || 1;
  const perPage = 3;

  return await Post.find({})
    .skip((currentPage - 1) * perPage)
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

const search = async (parent, args) => {
  return await Post.find({ $text: { $search: args.query } })
    .populate("postedBy", "username")
    .exec();
};

// Mutations
const postCreate = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);
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
  pubsub.publish(POST_ADDED, { postAdded: newPost });

  return newPost;
};

const postUpdate = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);
  if (args.input.content.trim() === "") throw new Error("Content is required");

  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  const postToUpdate = await Post.findById({ _id: args.input._id }).exec();
  if (currentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString())
    throw new Error("Unauthorized user");

  let updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true }
  ).populate("postedBy", "_id username");
  pubsub.publish(POST_UPDATED, { postUpdated: updatedPost });

  return updatedPost;
};

const postDelete = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  const postToDelete = await Post.findById({ _id: args.postId }).exec();
  if (currentUserFromDb._id.toString() !== postToDelete.postedBy._id.toString())
    throw new Error("Unauthorized user");

  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();
  pubsub.publish(POST_DELETED, { postDeleted: deletedPost });

  return deletedPost;
};

// Subscriptions
const postAdded = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(POST_ADDED),
};

const postUpdated = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(POST_UPDATED),
};

const postDeleted = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(POST_DELETED),
};

module.exports = {
  Query: {
    allPosts,
    postByUser,
    singlePost,
    totalPosts,
    search,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
  Subscription: {
    postAdded,
    postUpdated,
    postDeleted,
  },
};
