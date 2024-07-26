import React from 'react';
import { useQuery } from "@apollo/client";
import { gql } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';

const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      username
      name
      email
      images {
        url
        public_id
      }
      about
    }
  }
`;

const SingleUser = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username'); // Extract the username from the URL parameters

  console.log("Extracted username from URL:", username);

  const { loading, data, error } = useQuery(PUBLIC_PROFILE, {
    variables: { username },
    skip: !username, // Skip query if username is not provided
  });

  console.log("Data in single user is: ", data);

  if (loading) return <p className="p-5">Loading...</p>;
  if (error) return <p className="p-5">Error: {error.message}</p>;
  if (!data) return <p className="p-5">No user data found</p>;

  const user = data.publicProfile;

  return (
    <div className="container">
      <h1>{user.name}</h1>
      <p>@{user.username}</p>
      <p>{user.email}</p>
      <p>{user.about}</p>
      {user.images && user.images.length > 0 && (
        <div className="image-grid">
          {user.images.map((image) => (
            <img key={image.public_id} src={image.url} alt={image.public_id} className="img-fluid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleUser;
