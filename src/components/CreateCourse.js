import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
   
   //state is set initialliy to empty values and the values are updated when the user enters data into the form.
    state = { 
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        userId: this.props.context.authenticatedUser.id,
        errors:[]
   }

    render() {
        
        //Context is pulled from props via destructuring so that it's properties can be used. 
        const { context } = this.props;
        const authUser = context.authenticatedUser;

        //State is updated with these values based on what's entered into the form.  Each variable corresponds to the value attribute in the form.
        const { 
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            errors} = this.state

    return (
        <div className="wrap">
            <h2>Create Course</h2>
            <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create"
            // A render prop is used for the form across components to make the code more concise and consistent across views.
            elements={() => (
                <React.Fragment>
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input 
                            id="courseTitle" 
                            name="title" 
                            type="text"
                            value={title} 
                            onChange={this.change} 
                            placeholder="course title" />
                        <p>By {`${authUser.firstName} ${authUser.lastName}`}</p>
                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea 
                            id="courseDescription" 
                            name="description" 
                            type="textarea"
                            value={description} 
                            onChange={this.change} 
                            placeholder="enter a description of the course" />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input 
                                id="estimatedTime" 
                                name="estimatedTime" 
                                type="text"
                                value={estimatedTime} 
                                onChange={this.change} 
                                placeholder="estimated course length" />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea 
                                id="materialsNeeded" 
                                name="materialsNeeded"
                                type="text"
                                value={materialsNeeded} 
                                onChange={this.change} 
                                placeholder="materials" />
                    </div>    
                </div>
                </React.Fragment>
            )} />
        </div>
        )
    }
//The change method is called and uses setState to update the name/value pairs in the state object, defined above and updated in submit below.
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }
    //submit takes the values from the form that were entered and updates the state object, then creates a course object that is sent to the server.
      submit = () => {
        const { context } = this.props;
        
        const { 
            title, 
            description,
            estimatedTime,
            materialsNeeded
      } = this.state

      //Create a course that will get passed to context.data.createCourse and ultimately to the api.  userId, emailAddress and password are taken 
      //authenticatedUser in the context object.
        const course = { 
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            userId: context.authenticatedUser.id,
            emailAddress: context.authenticatedUser.emailAddress, 
            password: context.authenticatedUser.password
        }

        //Creates a new user using the createUser method in Data.js - user is passed as an argument and is the object  holds 
    //the user's information.

      context.data.createCourse(course)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          //If the response from Data.js returns no errors or an empty array, it means the course was created successfully.
          console.log(`Course: "${title}" has been created!`);
            this.props.history.push('/');
          };
        })
        .catch( err => { //handle rejected promises
          console.log(err);
          this.props.history.push('/error'); //push the error to the history stack and render the error page
        });
      }
    
      cancel = () => {
        this.props.history.push('/'); //push the user back to the home page
      }
}


