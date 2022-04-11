import React from 'react';

//UnhandledError is rendered if an error occurs that is not a 404 or 403.
const UnhandledError = () => {
    return (
        <div className="wrap">
            <h1 className="serious">Error</h1>
            <p>Sorry! We just encountered an unexpected error.</p>
        </div>
    );
}

export default UnhandledError;    