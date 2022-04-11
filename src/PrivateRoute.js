import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// PrivateRoute component is a high-order component for protecting routes.
// Component is destructured and renamed, all other props passed are passed via the ...rest variable
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
    <Consumer>
      {context => (
        <Route
          {...rest}
          // if the user is authenticated, render the components passed in as a prop via PrivateRoute in the Switch
          render={props =>context.authenticatedUser ? (
            
            <Component {...props} />
          ) : (
            
            //Redirect to the signin page if there is no authenticated user and store their intended target into state
            <Redirect to={{
              pathname: '/signin',
              state: { from: props.location},
              }} />
          )
          }
        />
      )}
    </Consumer>
  );
};

export default PrivateRoute;