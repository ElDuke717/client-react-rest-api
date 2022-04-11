import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

//UserSignOut handles the sign out process.
const UserSignOut = ({ context }) => {
  // adding useEffect here prevent conflicts with the render
  useEffect(() => context.actions.signOut());
  console.log(`sign-out successful, ${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName} has signed-out!`);
    return (
        <Redirect to="/" />
      );
}

export default UserSignOut;