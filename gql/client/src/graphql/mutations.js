import { USER_INFO, POST_DATA } from "./fragments";
import { gql } from "@apollo/client";

export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const USER_CREATE = gql`
  mutation userCreate($email: String!) {
    userCreate(email: $email) {
      username
      email
    }
  }
`;

export const POST_CREATE = gql`
  mutation postCreate($input: PostCreateInput!) {
    postCreate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_DELETE = gql`
  mutation postDelete($postId: String!) {
    postDelete(postId: $postId) {
      _id
    }
  }
`;

export const POST_UPDATE = gql`
  mutation postUpdate($input: PostUpdateInput!) {
    postUpdate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

