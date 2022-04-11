import React from 'react';
//NotFound is rendered if the user tries to access a page that doesn't exist.
const NotFound = () => {
    return (
        <div className="wrap">
            <p>We're sorry, the page you're looking for can't be found. 🤔</p>
            <p>Please check the URL and try again.</p>
            <h1>Error Code <span className="serious">404 - Page Not Found</span></h1>
        </div>
    );
}

export default NotFound;    