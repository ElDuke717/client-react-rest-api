import React from 'react';
import { Link } from 'react-router-dom';

//The Header component renders the authenticatedUser name, passed to it through props from the Context component
export default class Header extends React.PureComponent {
    render() {
      const { context } = this.props;
      const authUser = context.authenticatedUser;
      return (
        <div id="root">
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><a href="/">Lifetime Learning Course Catalog 🕶</a></h1>
                
                <nav>
                {/* Conditional logic is used to render the appropriate links, if the authenticatedUser is logged in, then welcome display is shown*/}
                  {authUser ? 
                    <React.Fragment>
                        <span>Welcome, {authUser.firstName}! 👋</span>
                        <Link to="/signout">Sign Out</Link>
                    </React.Fragment>
                  :
                    <React.Fragment>
                      <Link className="signup" to="/signup">Sign Up</Link>
                      <Link className="signin" to="/signin">Sign In</Link>
                    </React.Fragment>
                  }
                </nav>
            </div>
        </header>
        </div>
      );
    }
  };
