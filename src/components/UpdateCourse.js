import React, { Component } from 'react';
import axios from 'axios';
import Form from './Form';
import Forbidden from './Forbidden';

export default class UpdateCourse extends Component {
   
    //State is initialized with empty strings for title, description, estimatedTime and materialsNeeded.  userId is pulled from context and courseId is 
    //pulled from props, using conditional logic to accomodate 1, 2 and 3 digit (not likely) courseIds.
   state = { 
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        //userId here is not to be confused with userId from the course object.
        userId: this.props.context.authenticatedUser.id,
        //The logic in courseId pulls the exact course number from props and sets it to the state.  This is used to update the course.
        courseId: 
            this.props.location.pathname.length === 17 ? +this.props.location.pathname.substring(9, 10) :
            this.props.location.pathname.length === 18 ? +this.props.location.pathname.substring(9, 11) :
            this.props.location.pathname.length > 18 && +this.props.location.pathname.substring(9, 12),
        errors:[]
   }

    //componentDidMount is called after the component is rendered and allows the axios fetch request to complete before it proceeds. 
    componentDidMount() {
        this.getData();
    }

     //getData makes an axios call to the server and retrieves the data by passing in the courseId from state.
     getData = async () => {
        await axios.get(`http://localhost:5000/api/courses/${this.state.courseId}`)
        //The response from axios request is saved into the state, pushed into the array, and then the array is returned.
        .then(response => {
            const course = response.data;
            this.setState({
                title: course.title,
                description: course.description,
                estimatedTime: course.estimatedTime,
                materialsNeeded: course.materialsNeeded,
                //userId here is pulled from the course data and set to the state as courseAuthor.  This is used to check if the user is the author of the course.
                courseAuthor: course.userId
            })
        })
        .catch(error => {
            console.log(error.message);
            console.log(error)
            this.props.history.push("/notfound");
        });    
        }
        

    render() {
        
    //Context is pulled from props via destructuring so that it's properties can be used. 
    const { context } = this.props;
    //userId of the authenticatedUser
    const authUser = context.authenticatedUser;
    //userId of the courseAuthor
    const courseAuth = this.state.courseAuthor
    
    //State is updated with these values based on what's entered into the form.  Each variable corresponds to the value attribute in the form.
        const { 
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            errors} = this.state

     if (courseAuth !== authUser.id) { 
         return <Forbidden />
        } 
    return (
        <div className="wrap">
            <h2>Update Course</h2>
            <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update"
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
                            placeholder={title} />
                        <p>By {`${authUser.firstName} ${authUser.lastName}`}</p>
                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea 
                            id="courseDescription" 
                            name="description" 
                            type="textarea"
                            value={description} 
                            onChange={this.change} 
                            placeholder={description} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input 
                                id="estimatedTime" 
                                name="estimatedTime" 
                                type="text"
                                value={estimatedTime} 
                                onChange={this.change} 
                                placeholder={estimatedTime} />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea 
                                id="materialsNeeded" 
                                name="materialsNeeded"
                                type="text"
                                value={materialsNeeded} 
                                onChange={this.change} 
                                placeholder={materialsNeeded} />
                    </div>    
                </div>
                </React.Fragment>
            )} />
        </div>
        )
    }
    //Event handler for the change event that sets new values to the state to update the course.
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    //State is updated with the new values entered into the form.
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }
    
      submit = () => {
         //Define the variables that are added to the course object that's passed to updateCourse in context/data.js
        const { context } = this.props;
       //pull userId and courseId from context - we may not need userId here.
        const { 
            userId, 
            emailAddress, 
            password 
        } = context.authenticatedUser;
        
        //pull all other course properties from state.
        const { 
            courseId,
            title, 
            description,
            estimatedTime,
            materialsNeeded
        } = this.state

      //Create a course object that will get passed to context.data.updateCourse and ultimately to the api.
        const course = { 
            //entries from the form input
            courseId,
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            //entries from context
            userId,
            emailAddress, 
            password,
        }
    
    //Creates a new user using the createUser method in Data.js - user is passed as an argument and is the object  holds 
    //the user's information.

    context.data.updateCourse(course)
        .then( errors => {
        if (errors.length) {
            this.setState({ errors });
        } else {
          //If the response from Data.js returns no errors or an empty array, it means the course was updated successfully.
        console.log(`Course: "${title}" has been updated!`);
            this.props.history.push(`/courses/${courseId}`); //redirects to the course detail page after it has been updated.
            };
        })
        .catch( err => { //handle rejected promises
          console.log(err);
          this.props.history.push('/error'); //push the error to the history stack and render the error page
        });
    }
    
      cancel = () => {
        this.props.history.push(`/courses/${this.state.courseId}`); //push the user back to the course detail page.
      }
}


