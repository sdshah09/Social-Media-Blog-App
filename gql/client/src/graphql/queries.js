import { gql } from "@apollo/client";
import { POST_DATA, USER_INFO } from "./fragments";

export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const GET_ALL_POSTS = gql`
  query allPosts($page: Int!) {
    allPosts(page: $page) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const POST_BY_USER = gql`
  query {
    postByUser {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const SINGLE_POST = gql`
  query singlePost($postId: String!) {
    singlePost(postId: $postId) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const TOTAL_POSTS = gql`
  query {
    totalPosts
  }
`;

export const SEARCH = gql`
  query search($query: String!) {
    search(query: $query) {
      ...postData
    }
  }
  ${POST_DATA}
`;
