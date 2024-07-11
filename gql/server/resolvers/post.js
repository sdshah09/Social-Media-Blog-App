const {gql} = require('apollo-server-express');
const {posts} = require('../temp');

//queries
const totalPosts = () => posts.length;
const allPost = () => posts;

// mutation

const newPost = (parent,args) =>{ //newPost is a parent
    // create a new post opbeject
    console.log(args);
    const post = {
        id: posts.length + 1,
        title: args.title,
        description: args.description

    };
    // [ush new object to osts array]
    posts.push(post);
    return post
};
module.exports = {
    Query: {
        totalPosts,
        allPost
    },
    Mutation: {
        newPost
    }
}