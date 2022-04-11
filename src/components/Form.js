import React from 'react';

//This form component is used across several components for entering the appropriate data.  It is a render prop that handles submission and cancel actions as well as displaying errors and the form elements.
const Form = (props) => {
  //Props are values that are passed from the form elements from different views.  Values are extracted from props here using destructuring.
  const {
    cancel,
    errors,
    submit,
    submitButtonText,
    elements,
  } = props;
  
  //calls the submit function on each CRUD view, e.g. CreateCourse.js, DeleteCourse.js, UpdateCourse.js and those for authentication, UserSignUp.js and UserSignIn.js.
  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }
  
  //calls the cancel function on each form view.
  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <div>
      {/* ErrorsDisplay see below. */}
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        {/* Elements of each form are rendered by calling he elements passed through by props. */}
        {elements()}
        <div className="pad-bottom">
          {/* Button text for submit is set by each individual form view */}
          <button className="button" type="submit">{submitButtonText}</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
// ErrorsDisplay renders the errors passed to it from the API - missing form field entries etc.
function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;
  //If there are errors, they are displayed in a list.
  if (errors.length) {
    errorsDisplay = (
      <div className="validation--errors">
        <h3 >Validation errors</h3>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return errorsDisplay;
}

export default Form;