import React from "react";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "../graphql/queries";
import UserCard from '../components/UserCard';

const Users = () => {
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(ALL_USERS);

  if (usersLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error: {usersError.message}</p>;

  return (
    <div className="container">
      <div className="row p-5">
        <h2>Users</h2>
        {usersData &&
          usersData.allUsers &&
          usersData.allUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
      </div>
    </div>
  );
};

export default Users;
