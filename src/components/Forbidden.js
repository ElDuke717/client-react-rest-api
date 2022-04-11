import React from 'react';
//This view is rendered if the user tries to access a course without being authenticated or if it's by a different author.
const Forbidden = () => {
    return (
        <div className="wrap">
            <h1 className="serious">Forbidden</h1>
            <p>Sorry, you lack the credentials to access this page.</p>
        </div>
    );
}

export default Forbidden;    